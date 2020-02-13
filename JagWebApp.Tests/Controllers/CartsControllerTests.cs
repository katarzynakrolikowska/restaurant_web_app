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
    public class CartsControllerTests
    {
        private readonly Mock<ICartRepository> _cartRepo;
        private readonly Mock<IMenuRepository> _menuRepo;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly IMapper _mapper;
        private readonly CartsController _controller;

        public CartsControllerTests()
        {
            _cartRepo = new Mock<ICartRepository>();
            _menuRepo = new Mock<IMenuRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _controller = new CartsController(_cartRepo.Object, _menuRepo.Object, _unitOfWork.Object, _mapper);
        }

        [Fact]
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<SaveCartResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenMenuItemDoesNotExist_ReturnsBadRequest()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()));

            var result = await _controller.Create(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsSoldOut_ReturnsBadRequest()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(new MenuItem { Available = 0 });

            var result = await _controller.Create(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsValid_CartIsSaved()
        {
            SetValidInputForCreateMethod();

            await _controller.Create(new SaveCartResource());

            _cartRepo.Verify(cr => cr.Add(It.IsAny<Cart>()));
        }

        [Fact]
        public async void Create_WhenMenuItemIsValid_ReturnsOkObjectResult()
        {
            SetValidInputForCreateMethod();

            var result = await _controller.Create(new SaveCartResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<int>(result.Value);
        }

        private void SetValidInputForCreateMethod()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(new MenuItem { Available = 1 });
            _cartRepo.Setup(cr => cr.Add(It.IsAny<Cart>()));
        }
    }
}
