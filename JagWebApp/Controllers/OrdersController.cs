using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Hubs;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

        private int? GetLoggedInUserId()
        {
            return Core.Models.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }

        private async Task UpdateCartsItemsAmount(IEnumerable<MenuItem> menuItems)
        {
            foreach (var item in menuItems)
                await _cartRepository.UpdateCartItemAmountWithMenuItem(item);
        }
    }
}