using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.CartResources;
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
        public void GetCartAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetCartAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void GetCartAsync_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.GetCartAsync(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void GetCartAsync_WhenCartExists_ReturnsOkObjectResult()
        {
            _cartRepositoryMock.MockGetCart(new Cart());

            var result = await _controller.GetCartAsync(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<CartResource>(result.Value);
        }

        [Fact]
        public void GetUserCartAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.GetUserCartAsync();

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async Task GetUserCartAsync_WhenUserIsNull_ReturnsBadRequest()
        {
            User user = null;
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(user);

            var result = await _controller.GetUserCartAsync() as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task GetUserCartAsync_WhenUserIsAdmin_ReturnsBadRequest()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.GetUserCartAsync() as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async Task GetUserCartAsync_WhenUserIsNotAdmin_ReturnsOkObjectResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockGetUserCart(new Cart());

            var result = await _controller.GetUserCartAsync() as OkObjectResult;

            Assert.IsType<CartResource>(result.Value);
        }

        [Fact]
        public void CreateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.CreateAsync(It.IsAny<SaveCartResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void CreateAsync_WhenMenuItemDoesNotExist_ReturnsBadRequest()
        {
            MenuItem item = null;
            _menuRepositoryMock.MockGetMenuItem(item);

            var result = await _controller.CreateAsync(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenMenuItemIsSoldOut_ReturnsBadRequest()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 0 });

            var result = await _controller.CreateAsync(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void CreateAsync_WhenAnonymousUserSendRequest_UserIdOfCartIsNotSetUp()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(null, _controller);

            var result = await _controller.CreateAsync(new SaveCartResource()) as OkObjectResult;
            var value = result.Value as CartResource;

            Assert.Equal(0, value.UserId);
        }

        [Fact]
        public async void CreateAsync_WhenAdminSendRequest_UserIdOfCartIsNotSetUp()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.CreateAsync(new SaveCartResource()) as OkObjectResult;
            var value = result.Value as CartResource;

            Assert.Equal(0, value.UserId);
        }

        [Fact]
        public async void CreateAsync_WhenMenuItemIsValid_CartIsSaved()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockAdd();

            await _controller.CreateAsync(new SaveCartResource());

            _cartRepositoryMock.VerifyAdd();
        }

        [Fact]
        public async void CreateAsync_WhenMenuItemIsValid_ReturnsOkObjectResult()
        {
            _menuRepositoryMock.MockGetMenuItem(new MenuItem { Available = 1 });
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockIsInAdminRoleAsync(false);
            _cartRepositoryMock.MockAdd();

            var result = await _controller.CreateAsync(new SaveCartResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.IsType<CartResource>(result.Value);
        }

        [Fact]
        public void UpdateAnonymousCartToUserCartAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateAnonymousCartToUserCartAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateAnonymousCartToUserCartAsync_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.UpdateAnonymousCartToUserCartAsync(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateAnonymousCartToUserCartAsync_WhenUserIsAdmin_ReturnsBadRequest()
        {
            _cartRepositoryMock.MockGetCart(new Cart());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.UpdateAnonymousCartToUserCartAsync(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateAnonymousCartToUserCartAsync_WhenUserCartIsNull_NewCartIsUpdatedAsUserCart()
        {
            Cart userCart = null;
            var newCart = new Cart();
            _cartRepositoryMock.MockGetCart(newCart);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserStub.SetUser(1, _controller);
            _cartRepositoryMock.MockGetUserCart(userCart);

            var result = await _controller.UpdateAnonymousCartToUserCartAsync(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(1, newCart.UserId);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void UpdateAnonymousCartToUserCartAsync_WhenUserCartExists_NewCartItemsAreAddedToUserCart()
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

            var result = await _controller.UpdateAnonymousCartToUserCartAsync(It.IsAny<int>()) as OkObjectResult;

            _cartRepositoryMock.VerifyRemove(cart);
            _cartRepositoryMock.VerifyAddCartItemsToAnotherCart(cart, userCart);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void UpdateAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<JsonPatchDocument<UpdateCartResource>>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public void UpdateAsync_WhenPatchCartIsNull_ReturnsBadRequest()
        {
            var result = _controller.UpdateAsync(It.IsAny<int>(), null);

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UpdateAsync_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.UpdateAsync(It.IsAny<int>(), It.IsAny<JsonPatchDocument<UpdateCartResource>>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void UpdateAsync_WhenCartAfterUpdatingIsValid_ReturnsOkObjectResult()
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

            var result = await _controller.UpdateAsync(It.IsAny<int>(), patchCart) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void RemoveAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.RemoveAsync(It.IsAny<int>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void RemoveAsync_WhenCartDoesNotExist_ReturnsBadRequest()
        {
            Cart cart = null;
            _cartRepositoryMock.MockGetCart(cart);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void RemoveAsync_WhenCartExists_ReturnsOkResult()
        {
            var cart = new Cart();
            _cartRepositoryMock.MockGetCart(cart);
            _cartRepositoryMock.MockRemove(cart);

            var result = await _controller.RemoveAsync(It.IsAny<int>()) as OkResult;

            _cartRepositoryMock.VerifyRemove(cart);
            Assert.Equal(200, result.StatusCode);
        }
    }
}
