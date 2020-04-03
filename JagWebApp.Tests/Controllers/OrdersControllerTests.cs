using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using JagWebApp.Tests.Stubs;
using Microsoft.AspNetCore.Mvc;
using Moq;
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
        public void Create_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Create(It.IsAny<SaveOrderResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Create_WhenUserIsAdmin_ReturnsBadRequestResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.Create(It.IsAny<SaveOrderResource>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenUserCartIsNull_ReturnsBadRequestResult()
        {
            Cart cart = null;
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.Create(It.IsAny<SaveOrderResource>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenUserCartExist_ReturnsOkObjectResult()
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

            var result = await _controller.Create(new SaveOrderResource()) as OkObjectResult;

            _menuRepositoryMock.VerifyUpdateAvailability();
            _cartRepositoryMock.VerifyRemove(cart);
            _orderRepositoryMock.VerifyAdd();
            _unitOfWorkMock.VerifyCompleteAsync();
            Assert.Equal(200, result.StatusCode);
        }
    }
}
