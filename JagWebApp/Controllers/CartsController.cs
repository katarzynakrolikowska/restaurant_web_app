using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.CartResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public CartsController(
            ICartRepository cartRepository, 
            IMenuRepository menuRepository, 
            IUnitOfWork unitOfWork,
            UserManager<User> userManager,
            IMapper mapper)
        {
            _cartRepository = cartRepository;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
        }

        //GET: api/carts/1
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCartAsync(int id)
        {
            var cart = await _cartRepository.GetCartAsync(id);
            if (cart == null)
                return BadRequest();

            return Ok(_mapper.Map<CartResource>(cart));
        }

        //GET: api/carts/user/1
        [HttpGet("user")]
        public async Task<IActionResult> GetUserCartAsync()
        {
            var userId = (int)GetLoggedInUserId();

            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null || await _userManager.IsInRoleAsync(user, Role.ADMIN))
                return BadRequest();

            var cart = await _cartRepository.GetUserCartAsync(userId);

            return Ok(_mapper.Map<CartResource>(cart));
        }


        //POST: api/carts
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(SaveCartResource saveCart)
        {
            var menuItem = await _menuRepository.GetMenuItemAsync(saveCart.MenuItemId);
            if (menuItem == null || menuItem.Available < 1)
                return BadRequest();

            var cart = _mapper.Map<Cart>(saveCart);

            int? userId = GetLoggedInUserId();
            if (userId != null)
            {
                var user = await _userManager.FindByIdAsync(userId.ToString());
                if (!await _userManager.IsInRoleAsync(user, Role.ADMIN))
                    cart.UserId = userId;
            }

            _cartRepository.Add(cart);

            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<CartResource>(cart));
        }

        //PUT: api/carts/1
        [HttpPut("{cartId}")]
        public async Task<IActionResult> UpdateAnonymousCartToUserCartAsync(int cartId)
        {
            var cart = await _cartRepository.GetCartAsync(cartId, false);
            if (cart == null)
                return BadRequest();

            int? userId = GetLoggedInUserId();

            var loggedInUser = await _userManager.FindByIdAsync(userId.ToString());
            if (await _userManager.IsInRoleAsync(loggedInUser, Role.ADMIN))
                return BadRequest();

            var userCart = await _cartRepository.GetUserCartAsync((int)userId);
            if (userCart == null)
                cart.UserId = userId;
            else
            {
                _cartRepository.AddCartItemsToAnotherCart(cart, userCart);
                _cartRepository.Remove(cart);
            }
            
            await _unitOfWork.CompleteAsync();

            var newCart = await _cartRepository.GetUserCartAsync((int)userId);
            return Ok(_mapper.Map<CartResource>(newCart));
        }

        //PATCH: api/carts/1
        [AllowAnonymous]
        [HttpPatch("{cartId}")]
        public async Task<IActionResult> UpdateAsync(int cartId, [FromBody] JsonPatchDocument<UpdateCartResource> patchCart)
        {
            if (patchCart == null)
                return BadRequest();

            var cart = await _cartRepository.GetCartAsync(cartId);
            if (cart == null)
                return BadRequest();

            var updateCartResource = _mapper.Map<UpdateCartResource>(cart);
            
            patchCart.ApplyTo(updateCartResource, ModelState);

            var isValid = TryValidateModel(updateCartResource);
            if (!isValid)
                return BadRequest(updateCartResource);

            _mapper.Map(updateCartResource, cart);
            if (cart.Items.Count == 0)
                _cartRepository.Remove(cart);

            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<CartResource>(await _cartRepository.GetCartAsync(cartId)));
        }

        //DELETE: api/carts/1
        [AllowAnonymous]
        [HttpDelete("{cartId}")]
        public async Task<IActionResult> RemoveAsync(int cartId)
        {
            var cart = await _cartRepository.GetCartAsync(cartId, false);
            if (cart == null)
                return BadRequest();

            _cartRepository.Remove(cart);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        private int? GetLoggedInUserId()
        {
            return Core.Models.Identity.User.GetLoggedInUserId((ClaimsIdentity)User.Identity);
        }
    }
}