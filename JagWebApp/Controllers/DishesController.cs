using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.DishResources;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JagWebApp.Controllers
{
    [Authorize(Roles = Role.ADMIN)]
    [Route("api/[controller]")]
    [ApiController]
    public class DishesController : ControllerBase
    {
        private readonly IDishRepository _dishRepository;
        private readonly IDishCategoryRepository _categoryRepository;
        private readonly IPhotoRepository _photoRepository;
        private readonly IMenuRepository _menuRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public DishesController(
            IDishRepository dishRepository, 
            IDishCategoryRepository categoryRepository, 
            IPhotoRepository photoRepository,
            IMenuRepository menuRepository,
            IUnitOfWork unitOfWork, 
            IMapper mapper)
        {
            _dishRepository = dishRepository;
            _categoryRepository = categoryRepository;
            _photoRepository = photoRepository;
            _menuRepository = menuRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        //GET: api/dishes
        [HttpGet]
        public async Task<IActionResult> GetDishesAsync()
        {
            var dishes = await _dishRepository.GetDishesAsync();

            return Ok(_mapper.Map<IEnumerable<DishResource>>(dishes));
        }

        //GET: api/dishes/1
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDishAsync(int id)
        {
            var dish = await _dishRepository.GetDishAsync(id);

            if (dish == null)
                return NotFound();

            return Ok(_mapper.Map<SaveDishResource>(dish));
        }

        //POST: api/dishes
        [HttpPost]
        public async Task<IActionResult> CreateAsync(SaveDishResource saveDishResource)
        {
            if (!await _categoryRepository.CategoryExistsAsync(saveDishResource.CategoryId))
                return BadRequest();

            var dish = _mapper.Map<Dish>(saveDishResource);

            _dishRepository.Add(dish);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //PUT: api/dishes/1
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(int id, SaveDishResource saveDishResource)
        {
            var dish = await _dishRepository.GetDishAsync(id);

            if (dish == null)
                return NotFound();

            _mapper.Map(saveDishResource, dish);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //DELETE: api/dishes/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveAsync(int id)
        {
            var dish = await _dishRepository.GetDishAsync(id);

            if (dish == null)
                return NotFound();

            var menuItem = await _menuRepository.GetMenuItemWithDishAsync(id);
            if (menuItem != null)
                return BadRequest("Danie jest zapisane w Menu");

            var photos = dish.Photos;

            _photoRepository.Remove(photos);
            _dishRepository.Remove(dish);

            await _unitOfWork.CompleteAsync();

            return Ok();
        }
    }
}