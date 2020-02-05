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
    [Route("api/[controller]")]
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuRepository _menuRepository;
        private readonly IDishRepository _dishRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MenuController(
            IMenuRepository menuRepository, 
            IDishRepository dishRepository, 
            IUnitOfWork unitOfWork, 
            IMapper mapper)
        {
            _menuRepository = menuRepository;
            _dishRepository = dishRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        //GET: api/menu
        [HttpGet]
        public async Task<IActionResult> GetMenu()
        {
            var menuItems = await _menuRepository.GetMenuItems();
            return Ok(_mapper.Map<IEnumerable<MenuItem>, IEnumerable<MenuItemResource>>(menuItems));
        }

        //POST: api/menu
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(SaveMenuItemResource saveMenuItemResource)
        {
            if (saveMenuItemResource.Dishes.Count > 1 && await _menuRepository.GetMainMenuItem() != null)
                return BadRequest("Zestaw dnia już istnieje");

            if (!await _dishRepository.DishesExist(saveMenuItemResource.Dishes))
                return BadRequest("Niepoprawne dane");

            var menuItem = _mapper.Map<SaveMenuItemResource, MenuItem>(saveMenuItemResource);

            _menuRepository.Add(menuItem);
            await _unitOfWork.CompleteAsync();

            var menuItemFromRepo = await _menuRepository.GetMenuItem(menuItem.Id);

            return Ok(_mapper.Map<MenuItemResource>(menuItemFromRepo));
        }

        //POST: api/menu/1
        [Authorize(Roles = "Admin")]
        [HttpPost("{id}")]
        public async Task<IActionResult> UpdateMenuItem(int id, UpdateMenuItemResource updateMenuItemResource)
        {
            var item = await _menuRepository.GetMenuItem(id);
            if (item == null)
                return NotFound();

            item.Price = updateMenuItemResource.Price;
            item.Limit = updateMenuItemResource.Available - item.Available + item.Limit;
            item.Available = updateMenuItemResource.Available;
           
            await _unitOfWork.CompleteAsync();

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

            return Ok();
        }
    }
}