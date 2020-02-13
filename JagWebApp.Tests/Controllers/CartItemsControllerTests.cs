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
    public class CartItemsControllerTests
    {
        private readonly Mock<ICartItemRepository> _cartItemRepo;
        private readonly Mock<ICartRepository> _cartRepo;
        private readonly Mock<IMenuRepository> _menuRepo;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly IMapper _mapper;
        private readonly CartItemsController _controller;

        public CartItemsControllerTests()
        {
            _cartItemRepo = new Mock<ICartItemRepository>();
            _cartRepo = new Mock<ICartRepository>();
            _menuRepo = new Mock<IMenuRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _controller = new CartItemsController(
                _cartItemRepo.Object, 
                _menuRepo.Object, _cartRepo.Object, 
                _mapper, 
                _unitOfWork.Object);
        }

        [Fact]
        public async void GetCartItemsCount_WhenCalled_ReturnsOkObjectResult()
        {
            var result = await _controller.GetCartItemsCount(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<int>(result.Value);
        }

        [Fact]
        public async void GetCartItemsCount_WhenCartDoesNotExist_ReturnsZero()
        {
            //_cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>()));

            var result = await _controller.GetCartItemsCount(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(0, result.Value);
        }

        [Fact]
        public async void GetCartItemsCount_WhenCartExists_ReturnsItemsCount()
        {
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>()))
                .ReturnsAsync(new Cart());
            _cartItemRepo.Setup(cir => cir.GetCartItemsCount(It.IsAny<int>()))
                .Returns(1);

            var result = await _controller.GetCartItemsCount(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(1, result.Value);
        }

        [Fact]
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<SaveCartItemResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenMenuItemDoesNotExist_ReturnsBadRequestResult()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()));

            var result =await _controller.Create(new SaveCartItemResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartDoesNotExist_ReturnsBadRequestResult()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(new MenuItem());
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>()));

            var result = await _controller.Create(new SaveCartItemResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsSoldOut_ReturnsBadRequestResult()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(new MenuItem { Available = 0 });
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>()))
                .ReturnsAsync(new Cart());

            var result = await _controller.Create(new SaveCartItemResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemDoesNotExist_NewCartItemIsSaved()
        {
            SetValidInputForCreateMethod();
            _cartItemRepo.Setup(cir => cir.GetCartItem(It.IsAny<int>(), It.IsAny<int>()));
            _cartItemRepo.Setup(cir => cir.Add(It.IsAny<CartItem>()));
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            await _controller.Create(new SaveCartItemResource());

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            _cartItemRepo.Verify(cir => cir.Add(It.IsAny<CartItem>()));
        }

        [Fact]
        public async void Create_WhenCartItemExists_CartItemAmountIsIncreasedByOne()
        {
            var cartItem = new CartItem { Amount = 1 };
            SetValidInputForCreateMethod();
            _cartItemRepo.Setup(cir => cir.GetCartItem(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(cartItem);
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            await _controller.Create(new SaveCartItemResource());

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            Assert.Equal(2, cartItem.Amount);
        }

        private void SetValidInputForCreateMethod()
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(new MenuItem { Available = 1 });
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>()))
                .ReturnsAsync(new Cart());
        }
    }
}
