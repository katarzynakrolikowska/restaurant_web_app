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
    public class DishesController : ControllerBase
    {
        private readonly IDishRepository _dishRepository;
        private readonly IDishCategoryRepository _categoryRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DishesController(IDishRepository dishRepository, 
            IDishCategoryRepository categoryRepository, 
            IUnitOfWork unitOfWork, 
            IMapper mapper)
        {
            _dishRepository = dishRepository;
            _categoryRepository = categoryRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        // POST: api/Dishes
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateDish(SaveDishResource saveDishResource)
        {
            if (!ModelState.IsValid || !await _categoryRepository.CategoryExists(saveDishResource.CategoryId))
                return BadRequest("Niepoprawne dane");

            var dish = _mapper.Map<SaveDishResource, Dish>(saveDishResource);

            _dishRepository.Add(dish);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

    }
}