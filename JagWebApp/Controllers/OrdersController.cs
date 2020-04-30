using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Hubs;
using JagWebApp.Resources.MenuItemResources;
using JagWebApp.Resources.OrderResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        [Authorize(Roles = Role.ADMIN)]
        public async Task<IActionResult> GetOrdersAsync()
        {
            var orders = await _orderRepository.GetOrdersAsync();

            return Ok(_mapper.Map<IEnumerable<OrderAdminViewResource>>(orders));
        }

        //GET: api/orders/user
        [HttpGet("user")]
        public async Task<IActionResult> GetUserOrdersAsync()
        {
            var id = GetLoggedInUserId();
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (await _userManager.IsInRoleAsync(user, Role.ADMIN))
                return BadRequest();

            var orders = await _orderRepository.GetUserOrdersAsync((int)id);

            return Ok(_mapper.Map<IEnumerable<OrderResource>>(orders));
        }

        //GET: api/orders/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserOrderAsync(int id)
        {
            var userId = GetLoggedInUserId();
            var user = await _userManager.FindByIdAsync(userId.ToString());
            var isAdmin = await _userManager.IsInRoleAsync(user, Role.ADMIN);

            var order = isAdmin ? await _orderRepository.GetOrder(id) : await _orderRepository.GetUserOrderAsync(id, (int)userId);

            if (order == null)
                return BadRequest();
            
            return Ok(GetMappedOrder(order, isAdmin));
        }

        //POST: api/orders
        [HttpPost]
        public async Task<IActionResult> CreateAsync(SaveOrderResource saveOrder)
        {
            var id = GetLoggedInUserId();
            var user = await _userManager.FindByIdAsync(id.ToString());

            if (await _userManager.IsInRoleAsync(user, Role.ADMIN))
                return BadRequest();

            var cart = await _cartRepository.GetUserCartAsync((int)id);
            if (cart == null)
                return NotFound();

            var order = new Order() { Info = saveOrder.Info };

            _mapper.Map(cart, order);

            var updatedMenuItems = await _menuRepository.UpdateAvailabilityAsync(cart.Items);
            await UpdateCartsItemsAmountAsync(updatedMenuItems);
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
        [Authorize(Roles = Role.ADMIN)]
        public async Task<IActionResult> UpdateAsync(int orderId, JsonPatchDocument<UpdateOrderResource> patchOrder)
        {
            var order = await _orderRepository.GetOrder(orderId);
            if (order == null)
                return BadRequest();

            var updateOrder = _mapper.Map<UpdateOrderResource>(order);

            patchOrder.ApplyTo(updateOrder, ModelState);

            if (!TryValidateModel(updateOrder))
                return BadRequest();

            _mapper.Map(updateOrder, order);

            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        private int? GetLoggedInUserId()
        {
            return Core.Models.Identity.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }

        private async Task UpdateCartsItemsAmountAsync(IEnumerable<MenuItem> menuItems)
        {
            foreach (var item in menuItems)
                await _cartRepository.UpdateCartItemAmountOfMenuItemAsync(item);
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