using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class DishCategoriesControllerTests
    {
        private readonly DishCategoriesController _controller;
        private readonly DishCategoryRepositoryMock _dishCategoryRepositoryMock;
        private readonly UnitOfWorkMock _unitOfWorkMock;

        public DishCategoriesControllerTests()
        {
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            var dishCategoryRepo = new Mock<IDishCategoryRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            _controller = new DishCategoriesController(dishCategoryRepo.Object, mapper, unitOfWork.Object);

            _dishCategoryRepositoryMock = new DishCategoryRepositoryMock(dishCategoryRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
        }

        [Fact]
        public async void GetCategories_WhenCalled_GetCategoriesFromRepoIsCalled()
        {
            await _controller.GetCategories();

            _dishCategoryRepositoryMock.VerifyGetCategories();
        }

        [Fact]
        public async void GetCategories_WhenCalled_ReturnsCategories()
        {
            var categories = new List<Category>() { new Category() };
            _dishCategoryRepositoryMock.MockGetCategories(categories);

            var result = await _controller.GetCategories() as OkObjectResult;
            var values = result.Value as List<CategoryResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Single(values);
        }

        [Fact]
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<SaveCategoryResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenModelIsValid_CategoryIsSaved()
        {
            _dishCategoryRepositoryMock.MockAdd();
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.Create(new SaveCategoryResource());

            _dishCategoryRepositoryMock.VerifyAdd();
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void Create_WhenModelIsValid_ReturnsCategoryResource()
        {
            _dishCategoryRepositoryMock.MockAdd();

            var result = await _controller.Create(new SaveCategoryResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<CategoryResource>(result.Value);
        }

        [Fact]
        public void Update_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Update(It.IsAny<int>(), It.IsAny<SaveCategoryResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Update_WhenCategoryIsNull_ReturnsBadRequestResult()
        {
            Category category = null;
            _dishCategoryRepositoryMock.MockGetCategory(category);

            var result = await _controller.Update(It.IsAny<int>(), new SaveCategoryResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenModelIsValid_CategoryIsUpdated()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.Update(It.IsAny<int>(), new SaveCategoryResource());

            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void Update_WhenModelIsValid_ReturnsOkResult()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Update(It.IsAny<int>(), new SaveCategoryResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void Remove_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Remove(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Remove_WhenCategoryIsNull_ReturnsBadRequestResult()
        {
            Category category = null;
            _dishCategoryRepositoryMock.MockGetCategory(category);

            var result = await _controller.Remove(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCategoryExistsAndDishWithCategoryExists_ReturnsBadRequestObjectResult()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _dishCategoryRepositoryMock.MockDishWithCategoryExists(true);

            var result = await _controller.Remove(It.IsAny<int>()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
            Assert.IsType<string>(result.Value);
        }

        [Fact]
        public async void Remove_WhenCategoryExistsAndDishWithCategoryIsNull_CategoryIsRemoved()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _dishCategoryRepositoryMock.MockDishWithCategoryExists(false);
            _dishCategoryRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.Remove(It.IsAny<int>());

            _dishCategoryRepositoryMock.VerifyRemove();
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void Remove_WhenCategoryExistsAndDishWithCategoryIsNull_ReturnsOkResult()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _dishCategoryRepositoryMock.MockDishWithCategoryExists(false);
            _dishCategoryRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Remove(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
