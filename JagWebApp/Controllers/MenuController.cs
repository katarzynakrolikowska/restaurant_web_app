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

        //POST: api/menu
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(SaveMenuItemResource saveMenuItemResource)
        {
            if (await _dishRepository.GetDish(saveMenuItemResource.DishId) == null)
                return BadRequest("Niepoprawne dane");

            var menuItem = _mapper.Map<SaveMenuItemResource, MenuItem>(saveMenuItemResource);

            _menuRepository.Add(menuItem);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }
    }
}