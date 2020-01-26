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
    [Authorize(Roles = "Admin")]
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

        //GET: api/Dishes
        [HttpGet]
        public async Task<IActionResult> GetDishes()
        {
            var dishes = await _dishRepository.GetDishes();

            return Ok(_mapper.Map<IEnumerable<Dish>, IEnumerable<DishResource>>(dishes));
        }

        //GET: api/Dishes/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDish(int id)
        {
            var dish = await _dishRepository.GetDish(id);

            if (dish == null)
                return NotFound("Invalid dish id");

            return Ok(_mapper.Map<Dish, SaveDishResource>(dish));
        }

        //POST: api/Dishes
        [HttpPost]
        public async Task<IActionResult> CreateDish(SaveDishResource saveDishResource)
        {
            if (!ModelState.IsValid || !await _categoryRepository.CategoryExists(saveDishResource.CategoryId))
                return BadRequest("Niepoprawne dane");

            var dish = _mapper.Map<SaveDishResource, Dish>(saveDishResource);

            _dishRepository.Add(dish);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //PUT: api/Dishes/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDish(int id, SaveDishResource saveDishResource)
        {
            if (!ModelState.IsValid || id != saveDishResource.Id)
                return BadRequest("invalid");

            var dish = await _dishRepository.GetDish(id);

            if (dish == null)
                return NotFound();

            _mapper.Map(saveDishResource, dish);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //DELETE: api/Dishes/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveDish(int id)
        {
            var dish = await _dishRepository.GetDish(id);

            if (dish == null)
                return NotFound("Invalid dish id");

            _dishRepository.Remove(dish);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

    }
}