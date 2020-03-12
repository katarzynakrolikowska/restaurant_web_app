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
    public class DishesControllerTests
    {
        private readonly Mock<IDishRepository> _dishRepo;
        private readonly Mock<IDishCategoryRepository> _categoryRepo;
        private readonly Mock<IPhotoRepository> _photoRepo;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly IMapper _mapper;
        private readonly DishesController _controller;

        public DishesControllerTests()
        {
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _dishRepo = new Mock<IDishRepository>();
            _categoryRepo = new Mock<IDishCategoryRepository>();
            _photoRepo = new Mock<IPhotoRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _controller = new DishesController(
                _dishRepo.Object,
                _categoryRepo.Object,
                _photoRepo.Object,
                _unitOfWork.Object, _mapper);
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
            _dishRepo.Setup(dr => dr.GetDishes())
                .ReturnsAsync(It.IsAny<IEnumerable<Dish>>);

            await _controller.GetDishes();

            _dishRepo.Verify(dr => dr.GetDishes());
        }

        [Fact]
        public async void GetDishes_WhenCalled_ReturnsDishes()
        {
            var dishes = new List<Dish>() { new Dish() };
            _dishRepo.Setup(dr => dr.GetDishes())
                .ReturnsAsync(dishes);

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
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(dish);

            var result = await _controller.GetDish(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void GetDish_WhenCalled_GetDishFromRepoIsCalled()
        {
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(new Dish());

            await _controller.GetDish(It.IsAny<int>());

            _dishRepo.Verify(dr => dr.GetDish(It.IsAny<int>()));
        }

        [Fact]
        public async void GetDish_WhenDishExists_ReturnsOkObjectResultWithDish()
        {
            var dish = new Dish() { Name = "a" };
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(dish);

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
            _categoryRepo.Setup(cr => cr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(false);

            var result = await _controller.CreateDish(new SaveDishResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateDish_WhenCategoryExists_DishIsSaved()
        {
            _categoryRepo.Setup(cr => cr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(true);

            var result = await _controller.CreateDish(new SaveDishResource()) as OkResult;

            _dishRepo.Verify(dr => dr.Add(It.IsAny<Dish>()));
            _unitOfWork.Verify(u => u.CompleteAsync());
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
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(dish);

            var result = await _controller.RemoveDish(It.IsAny<int>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void RemoveDish_WhenDishExists_DishIsRemoved()
        {
            var dish = new Dish();
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(dish);
            _photoRepo.Setup(pr => pr.Remove(dish.Photos));
            _unitOfWork.Setup(u => u.CompleteAsync());

            await _controller.RemoveDish(It.IsAny<int>());

            _dishRepo.Verify(dr => dr.Remove(dish));
            _photoRepo.Verify(pr => pr.Remove(dish.Photos));
            _unitOfWork.Verify(u => u.CompleteAsync());
        }

        [Fact]
        public async void RemoveDish_WhenDishExists_ReturnsOkResult()
        {
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(new Dish());
            _unitOfWork.Setup(u => u.CompleteAsync());

            var result = await _controller.RemoveDish(It.IsAny<int>()) as OkResult;

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
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(dish);
            _unitOfWork.Setup(u => u.CompleteAsync());

            var result = await _controller.UpdateDish(It.IsAny<int>(), new SaveDishResource()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void UpdateDish_WhenDishExists_DishIsUpdated()
        {
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(new Dish());
            _unitOfWork.Setup(u => u.CompleteAsync());

            var result = await _controller.UpdateDish(It.IsAny<int>(), new SaveDishResource()) as OkResult;

            _dishRepo.Verify(dr => dr.GetDish(It.IsAny<int>()));
            _unitOfWork.Verify(u => u.CompleteAsync());
            Assert.Equal(200, result.StatusCode);
        }
    }
}
