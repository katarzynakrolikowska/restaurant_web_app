using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Hubs;
using JagWebApp.Resources.MenuItemResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace JagWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IDishRepository _dishRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICartRepository _cartRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<MenuItemHub> _hub;

        public MenuController(
            IMenuRepository menuRepository, 
            IDishRepository dishRepository, 
            IUnitOfWork unitOfWork,
            ICartRepository cartRepository,
            IMapper mapper,
            IHubContext<MenuItemHub> hub)
        {
            _menuRepository = menuRepository;
            _dishRepository = dishRepository;
            _unitOfWork = unitOfWork;
            _cartRepository = cartRepository;
            _mapper = mapper;
            _hub = hub;
        }

        //GET: api/menu
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMenuAsync()
        {
            var menuItems = await _menuRepository.GetMenuItemsAsync();
            return Ok(_mapper.Map<IEnumerable<MenuItemResource>>(menuItems));
        }

        //GET: api/menu/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMenuItemAsync(int id)
        {
            var item = await _menuRepository.GetMenuItemAsync(id);
            if (item == null)
                return NotFound();

            return Ok(_mapper.Map<MenuItemResource>(item));
        }

        //GET: api/menu/main
        [AllowAnonymous]
        [HttpGet("main")]
        public async Task<IActionResult> GetMainMenuItemAsync()
        {
            var item = await _menuRepository.GetMainMenuItemAsync();
            if (item == null)
                return NotFound();

            return Ok(_mapper.Map<MenuItemResource>(item));
        }


        //POST: api/menu
        [Authorize(Roles = Role.ADMIN)]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(SaveMenuItemResource saveMenuItemResource)
        {
            if (saveMenuItemResource.IsMain && await _menuRepository.GetMainMenuItemAsync() != null)
                return BadRequest("Zestaw dnia już istnieje");

            if (!await _dishRepository.DishesExistAsync(saveMenuItemResource.Dishes))
                return BadRequest("Niepoprawne dane");

            var menuItem = _mapper.Map<MenuItem>(saveMenuItemResource);

            _menuRepository.Add(menuItem);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //PUT: api/menu/1
        [Authorize(Roles = Role.ADMIN)]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, UpdateMenuItemResource updateMenuItemResource)
        {
            var item = await _menuRepository.GetMenuItemAsync(id);
            if (item == null)
                return NotFound();

            if (item.IsMain && (updateMenuItemResource.Dishes == null || updateMenuItemResource.Dishes.Count == 0))
                return BadRequest();

            _mapper.Map(updateMenuItemResource, item);
            await _cartRepository.UpdateCartItemAmountOfMenuItemAsync(item);
            await _unitOfWork.CompleteAsync();

            var updatedItem = await _menuRepository.GetMenuItemAsync(item.Id);

            await _hub.Clients.All.SendAsync(
                MenuItemHub.UPDATED_ITEM_METHOD_NAME,
                _mapper.Map<IEnumerable<MenuItemResource>>(new Collection<MenuItem>() { updatedItem }));

            return Ok();
        }

        //DELETE: api/menu/1
        [Authorize(Roles = Role.ADMIN)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAsync(int id)
        {
            var item = await _menuRepository.GetMenuItemAsync(id);
            if (item == null)
                return NotFound();

            _menuRepository.Remove(item);
            await _unitOfWork.CompleteAsync();

            await _hub.Clients.All.SendAsync(MenuItemHub.DELETED_ITEM_METHOD_NAME, _mapper.Map<MenuItemResource>(item));

            return Ok();
        }
    }
}