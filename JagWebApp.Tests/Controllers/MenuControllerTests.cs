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
    public class MenuControllerTests
    {
        private readonly Mock<IMenuRepository> _menuRepo;
        private readonly Mock<IDishRepository> _dishRepo;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly IMapper _mapper;
        private readonly MenuController _controller;

        public MenuControllerTests()
        {
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _menuRepo = new Mock<IMenuRepository>();
            _dishRepo = new Mock<IDishRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _controller = new MenuController(_menuRepo.Object, _dishRepo.Object, _unitOfWork.Object, _mapper);
        }

        [Fact]
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<SaveMenuItemResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenDishDoesNotExist_ReturnsBadRequestObjectResult()
        {
            var result = await _controller.Create(new SaveMenuItemResource()) as BadRequestObjectResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenDishExistsAndModelIsValid_MenuItemIsSaved()
        {
            SetValidInputForCreateMethod();

            await _controller.Create(new SaveMenuItemResource());

            _menuRepo.Verify(mr => mr.Add(It.IsAny<MenuItem>()));
        }

        [Fact]
        public async void Create_WhenDishExistsAndModelIsValid_ReturnsOkResult()
        {
            SetValidInputForCreateMethod();

            var result = await _controller.Create(new SaveMenuItemResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        private void SetValidInputForCreateMethod()
        {
            _dishRepo.Setup(dr => dr.GetDish(It.IsAny<int>()))
                .ReturnsAsync(new Dish());
            _menuRepo.Setup(mr => mr.Add(It.IsAny<MenuItem>()));
        }
    }
}
