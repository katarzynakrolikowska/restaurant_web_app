using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public CartsController(
            ICartRepository cartRepository, 
            IMenuRepository menuRepository, 
            IUnitOfWork unitOfWork, 
            IMapper mapper)
        {
            _cartRepository = cartRepository;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        //GET: api/carts
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCart(int id)
        {
            var cart = await _cartRepository.GetCart(id);
            if (cart == null)
                return BadRequest();

            return Ok(_mapper.Map<Cart, CartResource>(cart));
        }

        //POST: api/carts
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] int menuItemId)
        {
            var menuItem = await _menuRepository.GetMenuItem(menuItemId);
            if (menuItem == null || menuItem.Available < 1)
                return BadRequest();

            var cart = new Cart 
            { 
                Items = new Collection<CartItem> { new CartItem { MenuItemId = menuItemId, Amount = 1 } } 
            };
            _cartRepository.Add(cart);

            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<Cart, CartResource>(cart));
        }

    }
}