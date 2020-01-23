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
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly IMapper _mapper;
        private readonly DishesController _controller;

        public DishesControllerTests()
        {
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _dishRepo = new Mock<IDishRepository>();
            _categoryRepo = new Mock<IDishCategoryRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _controller = new DishesController( _dishRepo.Object, _categoryRepo.Object,  _unitOfWork.Object, _mapper);
        }

        [Fact]
        public void CreateDish_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateDish(It.IsAny<SaveDishResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateDish_WhenModelStateIsNotValid_ReturnsBadRequest()
        {
            _controller.ModelState.AddModelError("", "");

            var result = await _controller.CreateDish(new SaveDishResource()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateDish_WhenDishCategoryDoesNotExist_ReturnsBadRequest()
        {
            _categoryRepo.Setup(cr => cr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(false);

            var result = await _controller.CreateDish(new SaveDishResource()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateDish_WhenInputIsValid_DishIsSaved()
        {
            _categoryRepo.Setup(cr => cr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(true);

            await _controller.CreateDish(new SaveDishResource());

            _dishRepo.Verify(dr => dr.Add(It.IsAny<Dish>()));
            _unitOfWork.Verify(uow => uow.CompleteAsync());
        }

        [Fact]
        public async void CreateDish_WhenInputIsValid_ReturnsOkResult()
        {
            _categoryRepo.Setup(cr => cr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(true);

            var result = await _controller.CreateDish(new SaveDishResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
