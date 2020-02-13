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
    public class CartItemsController : ControllerBase
    {
        private readonly ICartItemRepository _cartItemRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public CartItemsController(
            ICartItemRepository cartItemRepository, 
            IMenuRepository menuRepository, 
            ICartRepository cartRepository,
            IMapper mapper, 
            IUnitOfWork unitOfWork)
        {
            _cartItemRepository = cartItemRepository;
            _menuRepository = menuRepository;
            _cartRepository = cartRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        //GET: api/cartItems/count/1
        [HttpGet("count/{cartId}")]
        public async Task<IActionResult> GetCartItemsCount(int cartId)
        {
            var count = 0;

            if (await _cartRepository.GetCart(cartId) != null)
                count = _cartItemRepository.GetCartItemsCount(cartId);

            return Ok(count);
        }

        //POST: api/cartItems
        [HttpPost]
        public async Task<IActionResult> Create(SaveCartItemResource saveCartItemResource)
        {
            var menuItem = await _menuRepository.GetMenuItem(saveCartItemResource.MenuItemId);
            if (menuItem == null ||
                await _cartRepository.GetCart(saveCartItemResource.CartId) == null ||
                menuItem.Available < 1)
                return BadRequest();

            var cartItem = await _cartItemRepository
                .GetCartItem(saveCartItemResource.CartId, saveCartItemResource.MenuItemId);

            if (cartItem != null)
                cartItem.Amount++;
            else
                _cartItemRepository.Add(_mapper.Map<SaveCartItemResource, CartItem>(saveCartItemResource));

            await _unitOfWork.CompleteAsync();

            return Ok();
        }
    }
}