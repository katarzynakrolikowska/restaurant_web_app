using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<int>(), It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenMenuItemDoesNotExist_ReturnsBadRequestResult()
        {
            MenuItem item = null;
            MockGetMenuItemFromMenuRepo(item);

            var result =await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartDoesNotExist_ReturnsBadRequestResult()
        {
            Cart cart = null;
            MockGetMenuItemFromMenuRepo(new MenuItem());
            MockGetCartFromCartRepo(cart);

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsSoldOut_ReturnsBadRequestResult()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 0 });
            MockGetCartFromCartRepo(new Cart());

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemsAmountIsEqualToMenuItemAvailable_ReturnsBadRequestResult()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 1 });
            MockGetCartFromCartRepo(new Cart());
            MockGetCartItemFromCartItemRepo(new CartItem { Amount = 1 });
                
            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemDoesNotExist_CartItemIsSaved()
        {
            CartItem cartItem = null;
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 1 });
            MockGetCartFromCartRepo(new Cart());
            MockGetCartItemFromCartItemRepo(cartItem);
            _cartItemRepo.Setup(cir => cir.Add(It.IsAny<Cart>(), It.IsAny<int>()));
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            _cartItemRepo.Verify(cir => cir.Add(It.IsAny<Cart>(), It.IsAny<int>()));
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemExists_CartItemAmountIsIncreasedByOne()
        {
            var cartItem = new CartItem { Amount = 1 };
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 2 });
            MockGetCartFromCartRepo(new Cart());
            MockGetCartItemFromCartItemRepo(cartItem);
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            Assert.Equal(2, cartItem.Amount);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void Remove_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Remove(It.IsAny<int>(), It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Remove_WhenMenuItemDoesNotExist_ReturnsBadRequestResult()
        {
            MenuItem menuItem = null;
            MockGetMenuItemFromMenuRepo(menuItem);

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartDoesNotExist_ReturnsBadRequestResult()
        {
            Cart cart = null;
            MockGetMenuItemFromMenuRepo(new MenuItem());
            MockGetCartFromCartRepo(cart);

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartItemDoesNotExist_ReturnsBadRequestResult()
        {
            CartItem cartItem = null;
            MockGetMenuItemFromMenuRepo(new MenuItem());
            MockGetCartFromCartRepo(new Cart());
            MockGetCartItemFromCartItemRepo(cartItem);

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartContainsOneItemWithAmountEqualsToOne_CartIsRemoved()
        {
            var item = new CartItem { Amount = 1 };
            MockGetMenuItemFromMenuRepo(new MenuItem());
            MockGetCartFromCartRepo(new Cart { Items = new Collection<CartItem> { item } });
            MockGetCartItemFromCartItemRepo(item);
            _cartRepo.Setup(cr => cr.Remove(It.IsAny<Cart>()));
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkResult;

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            _cartRepo.Verify(cr => cr.Remove(It.IsAny<Cart>()));
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartContainsSeveralItemsAndCartItemAmountIsEqualToOne_CartItemIsRemoved()
        {
            var items = new Collection<CartItem> { new CartItem(), new CartItem() };
            MockGetMenuItemFromMenuRepo(new MenuItem());
            MockGetCartFromCartRepo(new Cart { Items = items });
            MockGetCartItemFromCartItemRepo(new CartItem { Amount = 1 });
            _cartItemRepo.Setup(cir => cir.Remove(It.IsAny<Cart>(), It.IsAny<CartItem>()));
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            _cartItemRepo.Verify(cir => cir.Remove(It.IsAny<Cart>(), It.IsAny<CartItem>()));
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartItemAmountIsGreaterThanOne_CartItemAmountIsDecreasedByOne()
        {
            var cartItem = new CartItem { Amount = 2 };
            MockGetMenuItemFromMenuRepo(new MenuItem());
            MockGetCartFromCartRepo(new Cart());
            MockGetCartItemFromCartItemRepo(cartItem);
            _unitOfWork.Setup(uow => uow.CompleteAsync());

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWork.Verify(uow => uow.CompleteAsync());
            Assert.Equal(1, cartItem.Amount);
            Assert.Equal(200, result.StatusCode);
        }

        private void MockGetMenuItemFromMenuRepo(MenuItem item)
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
               .ReturnsAsync(item);
        }

        private void MockGetCartFromCartRepo(Cart cart)
        {
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>()))
                .ReturnsAsync(cart);
        }

        private void MockGetCartItemFromCartItemRepo(CartItem item)
        {
            _cartItemRepo.Setup(cir => cir.GetCartItem(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(item);
        }
    }
}
