using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Tests.Mocks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class CartItemsControllerTests
    {
        private readonly CartItemsController _controller;

        private readonly CartItemRepositoryMock _cartItemRepositoryMock;
        private readonly MenuRepositoryMock _menuRepositoryMock;
        private readonly CartRepositoryMock _cartRepositoryMock;
        private readonly UnitOfWorkMock _unitOfWorkMock;

        public CartItemsControllerTests()
        {
            var cartItemRepo = new Mock<ICartItemRepository>();
            var cartRepo = new Mock<ICartRepository>();
            var menuRepo = new Mock<IMenuRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();

            _controller = new CartItemsController(cartItemRepo.Object, menuRepo.Object, cartRepo.Object, mapper, unitOfWork.Object);

            _cartItemRepositoryMock = new CartItemRepositoryMock(cartItemRepo);
            _menuRepositoryMock = new MenuRepositoryMock(menuRepo);
            _cartRepositoryMock = new CartRepositoryMock(cartRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
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
            _menuRepositoryMock.MockGetMenuItem(item);

            var result =await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartDoesNotExist_ReturnsBadRequestResult()
        {
            Cart cart = null;
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsSoldOut_ReturnsBadRequestResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 0 });
            _cartRepositoryMock.MockGetCart(new Cart());

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemsAmountIsEqualToMenuItemAvailable_ReturnsBadRequestResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            _cartRepositoryMock.MockGetCart(new Cart());
            _cartItemRepositoryMock.MockGetCartItem(new CartItem { Amount = 1 });
                
            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemDoesNotExist_CartItemIsSaved()
        {
            CartItem cartItem = null;
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            _cartRepositoryMock.MockGetCart(new Cart());
            _cartItemRepositoryMock.MockGetCartItem(cartItem);
            _cartItemRepositoryMock.MockAdd();
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWorkMock.VerifyCompleteAsync();
            _cartItemRepositoryMock.VerifyAdd();
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenCartItemExists_CartItemAmountIsIncreasedByOne()
        {
            var cartItem = new CartItem { Amount = 1 };
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 2 });
            _cartRepositoryMock.MockGetCart(new Cart());
            _cartItemRepositoryMock.MockGetCartItem(cartItem);
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Create(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWorkMock.VerifyCompleteAsync();
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
        public async void Remove_WhenCartDoesNotExist_ReturnsBadRequestResult()
        {
            Cart cart = null;
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartItemDoesNotExist_ReturnsBadRequestResult()
        {
            CartItem cartItem = null;
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            _cartRepositoryMock.MockGetCart(new Cart());
            _cartItemRepositoryMock.MockGetCartItem(cartItem);

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartContainsOneItemWithAmountEqualsToOne_CartIsRemoved()
        {
            var item = new CartItem { Amount = 1 };
            var cart = new Cart { Items = new Collection<CartItem> { item } };
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            _cartRepositoryMock.MockGetCart(cart);
            _cartItemRepositoryMock.MockGetCartItem(item);
            _cartRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkResult;

            _unitOfWorkMock.VerifyCompleteAsync();
            _cartRepositoryMock.VerifyRemove(cart);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartContainsSeveralItemsAndCartItemAmountIsEqualToOne_CartItemIsRemoved()
        {
            var items = new Collection<CartItem> { new CartItem(), new CartItem() };
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            _cartRepositoryMock.MockGetCart(new Cart { Items = items });
            _cartItemRepositoryMock.MockGetCartItem(new CartItem { Amount = 1 });
            _cartItemRepositoryMock.MockRemove();
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWorkMock.VerifyCompleteAsync();
            _cartItemRepositoryMock.VerifyRemove();
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartItemAmountIsGreaterThanOne_CartItemAmountIsDecreasedByOne()
        {
            var cartItem = new CartItem { Amount = 2 };
            _menuRepositoryMock.MockGetMenuItem(new MenuItem());
            _cartRepositoryMock.MockGetCart(new Cart());
            _cartItemRepositoryMock.MockGetCartItem(cartItem);
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.Remove(It.IsAny<int>(), It.IsAny<int>()) as OkObjectResult;

            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(1, cartItem.Amount);
            Assert.Equal(200, result.StatusCode);
        }
    }
}
