using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Hubs;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IHubContext<MenuItemHub> _hub;

        public OrdersController(
            UserManager<User> userManager,
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IMenuRepository menuRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHubContext<MenuItemHub> hub)
        {
            _userManager = userManager;
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hub = hub;
        }

        //GET: api/orders
        [HttpGet()]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderRepository.GetOrders();

            return Ok(_mapper.Map<IEnumerable<OrderAdminViewResource>>(orders));
        }

        //GET: api/orders/user
        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrders()
        {
            var id = GetLoggedInUserId();
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (await _userManager.IsInRoleAsync(user, "Admin"))
                return BadRequest();

            var orders = await _orderRepository.GetUserOrders((int)id);

            return Ok(_mapper.Map<IEnumerable<OrderResource>>(orders));
        }

        //GET: api/orders/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserOrder(int id)
        {
            var userId = GetLoggedInUserId();
            var user = await _userManager.FindByIdAsync(userId.ToString());
            var isAdmin = await _userManager.IsInRoleAsync(user, "Admin");

            var order = isAdmin ? await _orderRepository.GetOrder(id) : await _orderRepository.GetUserOrder(id, (int)userId);

            if (order == null)
                return BadRequest();
            
            return Ok(GetMappedOrder(order, isAdmin));
        }

        //POST: api/orders
        [HttpPost]
        public async Task<IActionResult> Create(SaveOrderResource saveOrder)
        {
            var id = GetLoggedInUserId();
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (await _userManager.IsInRoleAsync(user, "Admin"))
                return BadRequest();

            var cart = await _cartRepository.GetUserCart((int)id);
            if (cart == null)
                return NotFound();

            var order = new Order()
            {
                Date = DateTime.Now,
                Info = saveOrder.Info
            };

            _mapper.Map(cart, order);

            var updatedMenuItems = await _menuRepository.UpdateAvailability(cart.Items);
            await UpdateCartsItemsAmount(updatedMenuItems);
            _cartRepository.Remove(cart);
            _orderRepository.Add(order);
            await _unitOfWork.CompleteAsync();

            await _hub.Clients.All.SendAsync(
                "transferUpdatedItem", 
                _mapper.Map<IEnumerable<MenuItem>, IEnumerable<MenuItemResource>>(updatedMenuItems));

            return Ok(_mapper.Map<OrderResource>(order));
        }

        //PATCH: api/orders/1
        [HttpPatch("{orderId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int orderId, JsonPatchDocument<UpdateOrderResource> patchOrder)
        {
            var order = await _orderRepository.GetOrder(orderId);
            if (order == null)
                return BadRequest();

            var updateOrder = _mapper.Map<UpdateOrderResource>(order);

            patchOrder.ApplyTo(updateOrder, ModelState);

            var isValid = TryValidateModel(updateOrder);
            if (!isValid)
                return BadRequest();

            _mapper.Map(updateOrder, order);

            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        private int? GetLoggedInUserId()
        {
            return Core.Models.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }

        private async Task UpdateCartsItemsAmount(IEnumerable<MenuItem> menuItems)
        {
            foreach (var item in menuItems)
                await _cartRepository.UpdateCartItemAmountWithMenuItem(item);
        }

        private object GetMappedOrder(Order order, bool isAdmin)
        {
            if (isAdmin)
                return _mapper.Map<OrderAdminViewResource>(order);
            else
                return _mapper.Map<OrderResource>(order);
        }
    }
}