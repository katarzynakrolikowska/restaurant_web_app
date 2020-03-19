using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Hubs;
using JagWebApp.Resources;
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
        private readonly IMapper _mapper;
        private readonly IHubContext<MenuItemHub> _hub;

        public MenuController(
            IMenuRepository menuRepository, 
            IDishRepository dishRepository, 
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IHubContext<MenuItemHub> hub)
        {
            _menuRepository = menuRepository;
            _dishRepository = dishRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _hub = hub;
        }

        //GET: api/menu
        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetMenu()
        {
            var menuItems = await _menuRepository.GetMenuItems();
            return Ok(_mapper.Map<IEnumerable<MenuItem>, IEnumerable<MenuItemResource>>(menuItems));
        }

        //GET: api/menu/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMenuItem(int id)
        {
            var item = await _menuRepository.GetMenuItem(id);
            if (item == null)
                return NotFound();

            return Ok(_mapper.Map<MenuItem, MenuItemResource>(item));
        }

        //POST: api/menu
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(SaveMenuItemResource saveMenuItemResource)
        {
            if (saveMenuItemResource.IsMain && await _menuRepository.GetMainMenuItem() != null)
                return BadRequest("Zestaw dnia już istnieje");

            if (!await _dishRepository.DishesExist(saveMenuItemResource.Dishes))
                return BadRequest("Niepoprawne dane");

            var menuItem = _mapper.Map<SaveMenuItemResource, MenuItem>(saveMenuItemResource);

            _menuRepository.Add(menuItem);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //PUT: api/menu/1
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, UpdateMenuItemResource updateMenuItemResource)
        {
            var item = await _menuRepository.GetMenuItem(id);
            if (item == null)
                return NotFound();

            if (item.IsMain && (updateMenuItemResource.Dishes == null || updateMenuItemResource.Dishes.Count == 0))
                return BadRequest();

            _mapper.Map(updateMenuItemResource, item);
            await _unitOfWork.CompleteAsync();

            await _hub.Clients.All.SendAsync(
               "transferUpdatedItem",
               _mapper.Map<MenuItem, MenuItemResource>(item));


            return Ok();
        }

        //DELETE: api/menu/1
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var item = await _menuRepository.GetMenuItem(id);
            if (item == null)
                return NotFound();

            _menuRepository.Remove(item);
            await _unitOfWork.CompleteAsync();

            await _hub.Clients.All.SendAsync(
               "transferDeletedItem",
               _mapper.Map<MenuItem, MenuItemResource>(item));

            return Ok();
        }
    }
}