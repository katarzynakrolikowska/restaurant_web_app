using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class DishCategoriesControllerTests
    {
        private readonly DishCategoriesController _controller;
        private readonly DishCategoryRepositoryMock _dishCategoryRepositoryMock;

        public DishCategoriesControllerTests()
        {
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            var dishCategoryRepo = new Mock<IDishCategoryRepository>();
            _controller = new DishCategoriesController(dishCategoryRepo.Object, mapper);

            _dishCategoryRepositoryMock = new DishCategoryRepositoryMock(dishCategoryRepo);
        }

        [Fact]
        public async void GetCategories_WhenCalled_GetCategoriesFromRepoIsCalled()
        {
            await _controller.GetCategories();

            _dishCategoryRepositoryMock.VerifyGetCategories();
        }

        [Fact]
        public async void GetCategories_WhenCalled_ReturnsOkActionResultWithCategories()
        {
            var categories = new List<Category>() { new Category() { Id = 1, Name = "a"} };
            _dishCategoryRepositoryMock.MockGetCategories(categories);

            var result = await _controller.GetCategories() as OkObjectResult;
            var values = result.Value as List<CategoryResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Single(values);
        }
    }
}
