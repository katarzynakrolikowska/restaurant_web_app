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
        private readonly IDishCategoryRepository _repository;
        private readonly IMapper _mapper;

        public DishCategoriesController(IDishCategoryRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/dishCategories
        [HttpGet]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _repository.GetCategories();

            return Ok(_mapper.Map<IEnumerable<Category>, IEnumerable<CategoryResource>>(categories));
        }
    }
}
