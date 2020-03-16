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
        public async void GetDishes_WhenCalled_ReturnsOkObjectResult()
        {
            var result = await _controller.GetDishes() as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void GetDishes_WhenCalled_GetDishesFromRepoIsCalled()
        {
            _dishRepositoryMock.MockGetDishes();

            await _controller.GetDishes();

            _dishRepositoryMock.VerifyGetDishes();
        }

        [Fact]
        public async void GetDishes_WhenCalled_ReturnsDishes()
        {
            var dishes = new List<Dish>() { new Dish() };
            _dishRepositoryMock.MockGetDishes(dishes);

            var result = await _controller.GetDishes() as OkObjectResult;
            var values = result.Value as List<DishResource>;

            Assert.Single(values);
        }

        [Fact]
        public void GetDish_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetDish(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetDish_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);            

            var result = await _controller.GetDish(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetDish_WhenCalled_GetDishFromRepoIsCalled()
        {
            _dishRepositoryMock.MockGetDish(new Dish());

            await _controller.GetDish(It.IsAny<int>());

            _dishRepositoryMock.VerifyGetDish();
        }

        [Fact]
        public async void GetDish_WhenDishExists_ReturnsOkObjectResultWithDish()
        {
            var dish = new Dish() { Name = "a" };
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.GetDish(It.IsAny<int>()) as OkObjectResult;
            var value = result.Value as SaveDishResource;

            Assert.Equal(200, result.StatusCode);
            Assert.Equal("a", value.Name);
        }

        [Fact]
        public void CreateDish_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateDish(It.IsAny<SaveDishResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateDish_WhenDishCategoryDoesNotExist_ReturnsBadRequestResult()
        {
            _dishCategoryRepositoryMock.MockCategoryExists(false);

            var result = await _controller.CreateDish(new SaveDishResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateDish_WhenCategoryExists_DishIsSaved()
        {
            _dishCategoryRepositoryMock.MockCategoryExists(true);
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.CreateDish(new SaveDishResource()) as OkResult;

            _dishRepositoryMock.VerifyAdd();
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateDish_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateDish(It.IsAny<int>(), It.IsAny<SaveDishResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateDish_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.UpdateDish(It.IsAny<int>(), new SaveDishResource()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateDish_WhenDishExists_DishIsUpdated()
        {
            _dishRepositoryMock.MockGetDish(new Dish());
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.UpdateDish(It.IsAny<int>(), new SaveDishResource()) as OkResult;

            _dishRepositoryMock.VerifyGetDish();
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void RemoveDish_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.RemoveDish(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void RemoveDish_WhenDishDoesNotExist_ReturnsNotFoundResult()
        {
            Dish dish = null;
            _dishRepositoryMock.MockGetDish(dish);

            var result = await _controller.RemoveDish(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void RemoveDish_WhenDishExistsInMenu_ReturnsBadRequestObjectResult()
        {
            _dishRepositoryMock.MockGetDish(new Dish());
            _menuRepositoryMock.MockGetMenuItemWithDish(new MenuItem());

            var result = await _controller.RemoveDish(It.IsAny<int>()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
            Assert.IsType<string>(result.Value);
        }

        [Fact]
        public async void RemoveDish_WhenDishExists_DishIsRemoved()
        {
            var dish = new Dish();
            MenuItem item = null;
            _dishRepositoryMock.MockGetDish(dish);
            _menuRepositoryMock.MockGetMenuItemWithDish(item);
            _photoRepositoryMock.MockRemove(dish.Photos);
            _unitOfWorkMock.MockCompleteAsync();

            await _controller.RemoveDish(It.IsAny<int>());

            _dishRepositoryMock.VerifyRemove(dish);
            _photoRepositoryMock.VerifyRemove(dish.Photos);
            _unitOfWorkMock.VerifyCompleteAsync();
        }

        [Fact]
        public async void RemoveDish_WhenDishExists_ReturnsOkResult()
        {
            MenuItem item = null;
            _dishRepositoryMock.MockGetDish(new Dish());
            _menuRepositoryMock.MockGetMenuItemWithDish(item);

            var result = await _controller.RemoveDish(It.IsAny<int>()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
