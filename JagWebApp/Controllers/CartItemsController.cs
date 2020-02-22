using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [AllowAnonymous]
    [Route("api/carts/{cartId}/item")]
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

        //POST: api/carts/1/item
        [HttpPost]
        public async Task<IActionResult> Create(int cartId, [FromBody] int menuItemId)
        {
            var menuItem = await _menuRepository.GetMenuItem(menuItemId);
            if (menuItem == null)
                return BadRequest();

            var cart = await _cartRepository.GetCart(cartId);
            if (cart == null || menuItem.Available < 1)
                return BadRequest();

            var cartItem = await _cartItemRepository
                .GetCartItem(cartId, menuItemId);

            if (cartItem == null)
                _cartItemRepository.Add(cart, menuItemId);
            else if (cartItem.Amount < menuItem.Available)
                cartItem.Amount++;
            else
                return BadRequest();

            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<Cart, CartResource>(cart));
        }

        //DELETE: api/carts/1/item/1
        [HttpDelete("{menuItemId}")]
        public async Task<IActionResult> Remove(int cartId, int menuItemId)
        {
            var cart = await _cartRepository.GetCart(cartId);
            if (cart == null)
                return BadRequest();

            var cartItem = await _cartItemRepository.GetCartItem(cartId, menuItemId);
            if (cartItem == null)
                return BadRequest();

            if (cart.Items.Count == 1 && cartItem.Amount == 1)
            {
                _cartRepository.Remove(cart);
                await _unitOfWork.CompleteAsync();
                return Ok(); 
            }
            
            if (cartItem.Amount == 1)
                _cartItemRepository.Remove(cart, cartItem);
            else
                cartItem.Amount--;

            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<Cart, CartResource>(cart));
        }
    }
}