using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.OrderResources;
using JagWebApp.Tests.Mocks;
using JagWebApp.Tests.Stubs;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class OrdersControllerTests
    {
        private readonly OrdersController _controller;

        private readonly OrderRepositoryMock _orderRepositoryMock;
        private readonly CartRepositoryMock _cartRepositoryMock;
        private readonly MenuRepositoryMock _menuRepositoryMock;
        private readonly UnitOfWorkMock _unitOfWorkMock;

        public OrdersControllerTests()
        {
            var userManager = UserManagerMock.UserManager;
            var orderRepo = new Mock<IOrderRepository>();
            var cartRepo = new Mock<ICartRepository>();
            var menuRepo = new Mock<IMenuRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            var hub = HubContextMock.Hub;


            _controller = new OrdersController(
                userManager.Object,
                orderRepo.Object,
                cartRepo.Object,
                menuRepo.Object,
                unitOfWork.Object,
                mapper,
                hub.Object);

            _orderRepositoryMock = new OrderRepositoryMock(orderRepo);
            _cartRepositoryMock = new CartRepositoryMock(cartRepo);
            _menuRepositoryMock = new MenuRepositoryMock(menuRepo);
            _unitOfWorkMock = new UnitOfWorkMock(unitOfWork);
        }

        [Fact]
        public async void GetOrdersAsync_WhenCalled_ReturnsOkObjectResult()
        {
            _orderRepositoryMock.MockGetOrders();

            var result = await _controller.GetOrdersAsync() as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<List<OrderAdminViewResource>>(result.Value);
        }

        [Fact]
        public void GetUserOrdersAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetUserOrdersAsync();

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetUserOrdersAsync_WhenUserIsAdmin_ReturnsBadRequestResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.GetUserOrdersAsync() as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void GetUserOrdersAsync_WhenUserIsNotAdmin_ReturnsOkObjectResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _orderRepositoryMock.MockGetUserOrders();

            var result = await _controller.GetUserOrdersAsync() as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<List<OrderResource>>(result.Value);
        }

        [Fact]
        public void GetUserOrderAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetUserOrderAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetUserOrderAsync_WhenUserIsAdminAndOrderIsNull_ReturnsBadRequestResult()
        {
            Order order = null;
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(true);
            _orderRepositoryMock.MockGetOrder(order);

            var result = await _controller.GetUserOrderAsync(It.IsAny<int>()) as BadRequestResult;

            _orderRepositoryMock.VerifyGetOrder();
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void GetUserOrderAsync_WhenUserIsNotAdminAndOrderIsNull_ReturnsBadRequestResult()
        {
            Order order = null;
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _orderRepositoryMock.MockGetUserOrder(order);

            var result = await _controller.GetUserOrderAsync(It.IsAny<int>()) as BadRequestResult;

            _orderRepositoryMock.VerifyGetUserOrder();
            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void GetUserOrderAsync_WhenUserIsAdminAndOrderExists_ReturnsOkObjectResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(true);
            _orderRepositoryMock.MockGetOrder(new Order());

            var result = await _controller.GetUserOrderAsync(It.IsAny<int>()) as OkObjectResult;

            _orderRepositoryMock.VerifyGetOrder();
            Assert.Equal(200, result.StatusCode);
            Assert.IsType<OrderAdminViewResource>(result.Value);
        }

        [Fact]
        public async void GetUserOrderAsync_WhenUserIsNotAdminAndOrderExists_ReturnsOkObjectResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _orderRepositoryMock.MockGetUserOrder(new Order());

            var result = await _controller.GetUserOrderAsync(It.IsAny<int>()) as OkObjectResult;

            _orderRepositoryMock.VerifyGetUserOrder();
            Assert.Equal(200, result.StatusCode);
            Assert.IsType<OrderResource>(result.Value);
        }

        [Fact]
        public void CreateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateAsync(It.IsAny<SaveOrderResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateAsync_WhenUserIsAdmin_ReturnsBadRequestResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.CreateAsync(It.IsAny<SaveOrderResource>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenUserCartIsNull_ReturnsNotFoundResult()
        {
            Cart cart = null;
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.CreateAsync(It.IsAny<SaveOrderResource>()) as NotFoundResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenUserCartExist_ReturnsOkObjectResult()
        {
            var cart = new Cart();
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockGetUserCart(cart);
            _menuRepositoryMock.MockUpdateAvailability();
            _cartRepositoryMock.MockRemove(cart);
            _orderRepositoryMock.MockAdd();
            _unitOfWorkMock.MockCompleteAsync();
            HubContextMock.MockHub();

            var result = await _controller.CreateAsync(new SaveOrderResource()) as OkObjectResult;

            _menuRepositoryMock.VerifyUpdateAvailability();
            _cartRepositoryMock.VerifyRemove(cart);
            _orderRepositoryMock.VerifyAdd();
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
            Assert.IsType<OrderResource>(result.Value);
        }

        [Fact]
        public void UpdateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<JsonPatchDocument<UpdateOrderResource>>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateAsync_WhenOrderIsNull_ReturnsBadRequestResult()
        {
            Order order = null;
            _orderRepositoryMock.MockGetOrder(order);

            var result = await _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<JsonPatchDocument<UpdateOrderResource>>())
                as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateAsync_WhenOrderExistsAndUpdatedOrderIsValid_ReturnsOkResult()
        {
            _orderRepositoryMock.MockGetOrder(new Order());
            ObjectModelValidatorMock.SetObjectValidator(_controller);
            _unitOfWorkMock.MockCompleteAsync();

            var result = await _controller.UpdateAsync(It.IsAny<int>(), new JsonPatchDocument<UpdateOrderResource>())
                as OkResult;

            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
        }
    }
}
