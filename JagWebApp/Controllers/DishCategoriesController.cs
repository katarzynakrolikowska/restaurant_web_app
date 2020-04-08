using System.Collections.Generic;
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
    [Route("api/[controller]")]
    [ApiController]
    public class DishCategoriesController : ControllerBase
    {
        private readonly IDishCategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public DishCategoriesController(IDishCategoryRepository repository, IMapper mapper, IUnitOfWork unitOfWork)
        {
            _categoryRepository = repository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        //GET: api/dishCategories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _categoryRepository.GetCategories();

            return Ok(_mapper.Map<IEnumerable<CategoryResource>>(categories));
        }

        //POST: api/dishCategories
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(SaveCategoryResource saveCategory)
        {
            var category = _mapper.Map<Category>(saveCategory);

            _categoryRepository.Add(category);
            await _unitOfWork.CompleteAsync();

            return Ok(_mapper.Map<CategoryResource>(category));
        }

        //PUT: api/dishCategories/1
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SaveCategoryResource category)
        {
            var categoryFromDb = await _categoryRepository.GetCategory(id);
            if (categoryFromDb == null)
                return BadRequest();

            _mapper.Map(category, categoryFromDb);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        //DELETE: api/dishCategories/1
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Remove(int id)
        {
            var category = await _categoryRepository.GetCategory(id);
            if (category == null)
                return BadRequest();

            if (await _categoryRepository.DishWithCategoryExists(id))
                return BadRequest("Category is used");

            _categoryRepository.Remove(category);
            await _unitOfWork.CompleteAsync();

            return Ok();
        }
    }
}
