using System;
using System.Collections.Generic;
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
        [HttpGet]
        public async Task<IActionResult> GetCarts()
        {
            var carts = await _cartRepository.GetCarts();

            return Ok(_mapper.Map<IEnumerable<Cart>, IEnumerable<CartResource>>(carts));
        }

        //POST: api/carts
        [HttpPost]
        public async Task<IActionResult> Create(SaveCartResource saveCartResource)
        {
            var menuItem = await _menuRepository.GetMenuItem(saveCartResource.MenuItemId);
            if (menuItem == null || menuItem.Available < 1)
                return BadRequest();

            var cart = _mapper.Map<SaveCartResource, Cart>(saveCartResource);
            _cartRepository.Add(cart);

            await _unitOfWork.CompleteAsync();

            return Ok(cart.Id);
        }

    }
}