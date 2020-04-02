using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
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

        public OrdersController(
            UserManager<User> userManager,
            IOrderRepository orderRepository,
            ICartRepository cartRepository,
            IMenuRepository menuRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _userManager = userManager;
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
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
                return BadRequest();

            var order = new Order()
            {
                Date = DateTime.Now,
                Info = saveOrder.Info
            };

            _mapper.Map(cart, order);

            await _menuRepository.UpdateAvailability(cart.Items);
            _cartRepository.Remove(cart);
            _orderRepository.Add(order);
            await _unitOfWork.CompleteAsync();

            return Ok(order.Id);
        }

        private int? GetLoggedInUserId()
        {
            return Core.Models.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }
    }
}