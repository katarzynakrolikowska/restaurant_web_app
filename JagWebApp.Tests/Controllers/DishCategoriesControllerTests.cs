using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources.CategoryResources;
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
        public async void GetCategoriesAsync_WhenCalled_GetCategoriesFromRepoIsCalled()
        {
            await _controller.GetCategoriesAsync();

            _dishCategoryRepositoryMock.VerifyGetCategories();
        }

        [Fact]
        public async void GetCategoriesAsync_WhenCalled_ReturnsCategories()
        {
            var categories = new List<Category>() { new Category() };
            _dishCategoryRepositoryMock.MockGetCategories(categories);

            var result = await _controller.GetCategoriesAsync() as OkObjectResult;
            var values = result.Value as List<CategoryResource>;

            Assert.Equal(200, result.StatusCode);
            Assert.Single(values);
        }

        [Fact]
        public void CreateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateAsync(It.IsAny<SaveCategoryResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateAsync_WhenModelIsValid_CategoryIsSaved()
        {
            _dishCategoryRepositoryMock.MockAdd();
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.CreateAsync(new SaveCategoryResource());

            _dishCategoryRepositoryMock.VerifyAdd();
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void CreateAsync_WhenModelIsValid_ReturnsCategoryResource()
        {
            _dishCategoryRepositoryMock.MockAdd();

            var result = await _controller.CreateAsync(new SaveCategoryResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<CategoryResource>(result.Value);
        }

        [Fact]
        public void UpdateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<SaveCategoryResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateAsync_WhenCategoryIsNull_ReturnsBadRequestResult()
        {
            Category category = null;
            _dishCategoryRepositoryMock.MockGetCategory(category);

            var result = await _controller.UpdateAsync(It.IsAny<int>(), new SaveCategoryResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateAsync_WhenModelIsValid_CategoryIsUpdated()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.UpdateAsync(It.IsAny<int>(), new SaveCategoryResource());

            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void UpdateAsync_WhenModelIsValid_ReturnsOkResult()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.UpdateAsync(It.IsAny<int>(), new SaveCategoryResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void RemoveAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.RemoveAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void RemoveAsync_WhenCategoryIsNull_ReturnsBadRequestResult()
        {
            Category category = null;
            _dishCategoryRepositoryMock.MockGetCategory(category);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void RemoveAsync_WhenCategoryExistsAndDishWithCategoryExists_ReturnsBadRequestObjectResult()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _dishCategoryRepositoryMock.MockDishWithCategoryExists(true);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
            Assert.IsType<string>(result.Value);
        }

        [Fact]
        public async void RemoveAsync_WhenCategoryExistsAndDishWithCategoryIsNull_CategoryIsRemoved()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _dishCategoryRepositoryMock.MockDishWithCategoryExists(false);
            _dishCategoryRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.RemoveAsync(It.IsAny<int>());

            _dishCategoryRepositoryMock.VerifyRemove();
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void RemoveAsync_WhenCategoryExistsAndDishWithCategoryIsNull_ReturnsOkResult()
        {
            _dishCategoryRepositoryMock.MockGetCategory(new Category());
            _dishCategoryRepositoryMock.MockDishWithCategoryExists(false);
            _dishCategoryRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
