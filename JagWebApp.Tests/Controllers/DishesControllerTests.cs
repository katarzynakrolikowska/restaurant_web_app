using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources.DishResources;
using JagWebApp.Tests.Mocks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class DishesControllerTests
    {
        private readonly DishesController _controller;

        private readonly DishRepositoryMock _dishRepositoryMock;
        private readonly DishCategoryRepositoryMock _dishCategoryRepositoryMock;
        private readonly PhotoRepositoryMock _photoRepositoryMock;
        private readonly MenuRepositoryMock _menuRepositoryMock;
        private readonly UnitOfWorkMock _unitOfWorkMock;

        public DishesControllerTests()
        {
            var dishRepo = new Mock<IDishRepository>();
            var dishCategoryRepo = new Mock<IDishCategoryRepository>();
            var photoRepo = new Mock<IPhotoRepository>();
            var menuRepo = new Mock<IMenuRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();

            _controller = new DishesController(
                dishRepo.Object,
                dishCategoryRepo.Object,
                photoRepo.Object,
                menuRepo.Object,
                unitOfWork.Object, 
                mapper);

            _dishRepositoryMock = new DishRepositoryMock(dishRepo);
            _dishCategoryRepositoryMock = new DishCategoryRepositoryMock(dishCategoryRepo);
            _photoRepositoryMock = new PhotoRepositoryMock(photoRepo);
            _menuRepositoryMock = new MenuRepositoryMock(menuRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
        }

        [Fact]
        public async void GetDishesAsync_WhenCalled_ReturnsOkObjectResult()
        {
            var result = await _controller.GetDishesAsync() as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void GetDishesAsync_WhenCalled_GetDishesFromRepoIsCalled()
        {
            _dishRepositoryMock.MockGetDishes();

            await _controller.GetDishesAsync();

            _dishRepositoryMock.VerifyGetDishes();
        }

        [Fact]
        public async void GetDishesAsync_WhenCalled_ReturnsDishes()
        {
            var dishes = new List<Dish>() { new Dish() };
            _dishRepositoryMock.MockGetDishes(dishes);

            var result = await _controller.GetDishesAsync() as OkObjectResult;
            var values = result.Value as List<DishResource>;

            Assert.Single(values);
        }

        [Fact]
        public void GetDishAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetDishAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetDishAsync_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);            

            var result = await _controller.GetDishAsync(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetDishAsync_WhenCalled_GetDishFromRepoIsCalled()
        {
            _dishRepositoryMock.MockGetDish(new Dish());

            await _controller.GetDishAsync(It.IsAny<int>());

            _dishRepositoryMock.VerifyGetDish();
        }

        [Fact]
        public async void GetDishAsync_WhenDishExists_ReturnsOkObjectResultWithDish()
        {
            var dish = new Dish() { Name = "a" };
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.GetDishAsync(It.IsAny<int>()) as OkObjectResult;
            var value = result.Value as SaveDishResource;

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("a", value.Name);
        }

        [Fact]
        public void CreateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateAsync(It.IsAny<SaveDishResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateAsync_WhenDishCategoryDoesNotExist_ReturnsBadRequestResult()
        {
            _dishCategoryRepositoryMock.MockCategoryExists(false);

            var result = await _controller.CreateAsync(new SaveDishResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenCategoryExists_DishIsSaved()
        {
            _dishCategoryRepositoryMock.MockCategoryExists(true);
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.CreateAsync(new SaveDishResource()) as OkResult;

            _dishRepositoryMock.VerifyAdd();
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<SaveDishResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateAsync_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.UpdateAsync(It.IsAny<int>(), new SaveDishResource()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateAsync_WhenDishExists_DishIsUpdated()
        {
            _dishRepositoryMock.MockGetDish(new Dish());
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.UpdateAsync(It.IsAny<int>(), new SaveDishResource()) as OkResult;

            _dishRepositoryMock.VerifyGetDish();
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void RemoveAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.RemoveAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void RemoveAsync_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void RemoveAsync_WhenDishExistsInMenu_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockGetDish(new Dish());
            _menuRepositoryMock.MockGetMenuItemWithDish(new MenuItem());

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
            Assert.IsType<string>(result.Value);
        }

        [Fact]
        public async void RemoveAsync_WhenDishExists_DishIsRemoved()
        {
            var dish = new Dish();
            MenuItem item = null;
            _dishRepositoryMock.MockGetDish(dish);
            _menuRepositoryMock.MockGetMenuItemWithDish(item);
            _photoRepositoryMock.MockRemove(dish.Photos);
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.RemoveAsync(It.IsAny<int>());

            _dishRepositoryMock.VerifyRemove(dish);
            _photoRepositoryMock.VerifyRemove(dish.Photos);
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void RemoveAsync_WhenDishExists_ReturnsOkResult()
        {
            MenuItem item = null;
            _dishRepositoryMock.MockGetDish(new Dish());
            _menuRepositoryMock.MockGetMenuItemWithDish(item);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
