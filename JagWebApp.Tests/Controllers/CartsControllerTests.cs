using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using JagWebApp.Tests.Stubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class CartsControllerTests
    {
        private readonly CartsController _controller;

        private readonly MenuRepositoryMock _menuRepositoryMock;
        private readonly CartRepositoryMock _cartRepositoryMock;

        public CartsControllerTests()
        {
            var mockUserStore = new Mock<IUserStore<User>>();

            var cartRepo = new Mock<ICartRepository>();
            var menuRepo = new Mock<IMenuRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var userManager = UserManagerMock.UserManager;
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();

            _controller = new CartsController(cartRepo.Object, menuRepo.Object, unitOfWork.Object, userManager.Object, mapper);

            _menuRepositoryMock = new MenuRepositoryMock(menuRepo);
            _cartRepositoryMock = new CartRepositoryMock(cartRepo);
        }

        [Fact]
        public void GetCart_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetCart(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetCart_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.GetCart(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void GetCart_WhenCartExists_ReturnsOkObjectResult()
        {
            _cartRepositoryMock.MockGetCart(new Cart());

            var result = await _controller.GetCart(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<CartResource>(result.Value);
        }

        [Fact]
        public void GetUserCart_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetUserCart(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
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
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller.Create(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsSoldOut_ReturnsBadRequest()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 0 });

            var result = await _controller.Create(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenAnonymousUserSendRequest_UserIdOfCartIsNotSetUp()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(null, _controller);

            var result = await _controller.Create(new SaveCartResource()) as OkObjectResult;
            var value = result.Value as CartResource;

            Assert.Equal(0, value.UserId);
        }

        [Fact]
        public async void Create_WhenAdminSendRequest_UserIdOfCartIsNotSetUp()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(1, _controller);

            UserManagerMock.MockIsInAdminRoleAsync(true);
            var result = await _controller.Create(new SaveCartResource()) as OkObjectResult;
            var value = result.Value as CartResource;

            Assert.Equal(0, value.UserId);
        }

        [Fact]
        public async void Create_WhenMenuItemIsValid_CartIsSaved()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockAdd();

            await _controller.Create(new SaveCartResource());

            _cartRepositoryMock.VerifyAdd();
        }

        [Fact]
        public async void Create_WhenMenuItemIsValid_ReturnsOkObjectResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockAdd();

            var result = await _controller.Create(new SaveCartResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<CartResource>(result.Value);
        }

        [Fact]
        public void Update_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Update(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Update_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.Update(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserIsLoggedOut_ReturnsBadRequest()
        {
            _cartRepositoryMock.MockGetCart(new Cart());
            UserStub.SetUser(null, _controller);

            var result = await _controller.Update(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserIsAdmin_ReturnsBadRequest()
        {
            _cartRepositoryMock.MockGetCart(new Cart());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.Update(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserCartIsNull_NewCartIsUpdatedAsUserCart()
        {
            Cart userCart = null;
            var newCart = new Cart();
            _cartRepositoryMock.MockGetCart(newCart);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserStub.SetUser(1, _controller);
            _cartRepositoryMock.MockGetUserCart(userCart);

            var result = await _controller.Update(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(1, newCart.UserId);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserCartExists_NewCartItemsAreAddedToUserCart()
        {
            var cart = new Cart();
            var userCart = new Cart();
            _cartRepositoryMock.MockGetCart(cart);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserStub.SetUser(1, _controller);
            _cartRepositoryMock.MockGetUserCart(userCart);
            _cartRepositoryMock.MockRemove(cart);
            _cartRepositoryMock.MockAddCartItemsToAnotherCart(cart, userCart);

            var result = await _controller.Update(It.IsAny<int>()) as OkObjectResult;

            _cartRepositoryMock.VerifyRemove(cart);
            _cartRepositoryMock.VerifyAddCartItemsToAnotherCart(cart, userCart);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateCart_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateCart(It.IsAny<int>(), It.IsAny<JsonPatchDocument<UpdateCartResource>>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public void UpdateCart_WhenPatchCartIsNull_ReturnsBadRequest()
        {
            var result = _controller.UpdateCart(It.IsAny<int>(), null);

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateCart_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.UpdateCart(It.IsAny<int>(), It.IsAny<JsonPatchDocument<UpdateCartResource>>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateCart_WhenCartAfterUpdatingIsValid_ReturnsOkObjectResult()
        {
            var cart = new Cart();
            var patchCart = new JsonPatchDocument<UpdateCartResource>();
            _cartRepositoryMock.MockGetCart(cart);
            var objectValidator = new Mock<IObjectModelValidator>();
            objectValidator.Setup(o => o.Validate(It.IsAny<ActionContext>(),
                                              It.IsAny<ValidationStateDictionary>(),
                                              It.IsAny<string>(),
                                              It.IsAny<object>()));
            _controller.ObjectValidator = objectValidator.Object;

            var result = await _controller.UpdateCart(It.IsAny<int>(), patchCart) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void Remove_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Remove(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Remove_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.Remove(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartExists_ReturnsOkResult()
        {
            var cart = new Cart();
            _cartRepositoryMock.MockGetCart(cart);
            _cartRepositoryMock.MockRemove(cart);

            var result = await _controller.Remove(It.IsAny<int>()) as OkResult;

            _cartRepositoryMock.VerifyRemove(cart);
            Assert.Equal(200, result.StatusCode);
        }
    }
}
