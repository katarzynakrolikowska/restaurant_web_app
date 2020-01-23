using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class DishCategoriesControllerTests
    {
        private readonly Mock<IDishCategoryRepository> _repo;
        private readonly IMapper _mapper;
        private readonly DishCategoriesController _controller;

        public DishCategoriesControllerTests()
        {
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _repo = new Mock<IDishCategoryRepository>();
            _controller = new DishCategoriesController(_repo.Object, _mapper);
        }

        [Fact]
        public async void GetCategories_WhenCalled_GetCategoriesFromRepoIsCalled()
        {
            await _controller.GetCategories();

            _repo.Verify(r => r.GetCategories());
        }

        [Fact]
        public async void GetCategories_WhenCalled_ReturnsOkActionResultWithCategories()
        {
            var categories = new List<Category>() { new Category() { Id = 1, Name = "a"} };
            _repo.Setup(r => r.GetCategories())
                .ReturnsAsync(categories);

            var result = await _controller.GetCategories() as OkObjectResult;
            var values = result.Value as List<CategoryResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Single(values);
        }
    }
}
