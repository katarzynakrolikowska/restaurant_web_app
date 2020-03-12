using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class CartsControllerTests
    {
        private readonly Mock<ICartRepository> _cartRepo;
        private readonly Mock<IMenuRepository> _menuRepo;
        private readonly Mock<IUnitOfWork> _unitOfWork;
        private readonly Mock<UserManager<User>> _userManager;
        private readonly IMapper _mapper;
        private readonly CartsController _controller;

        public CartsControllerTests()
        {
            var mockUserStore = new Mock<IUserStore<User>>();

            _cartRepo = new Mock<ICartRepository>();
            _menuRepo = new Mock<IMenuRepository>();
            _unitOfWork = new Mock<IUnitOfWork>();
            _userManager = new Mock<UserManager<User>>(mockUserStore.Object, null, null, null, null, null, null, null, null);
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _controller = new CartsController(
                _cartRepo.Object, 
                _menuRepo.Object, 
                _unitOfWork.Object, 
                _userManager.Object,
                _mapper);
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
            MockGetCartFromCartRepo(cart);

            var result = await _controller.GetCart(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void GetCart_WhenCartExists_ReturnsOkObjectResult()
        {
            MockGetCartFromCartRepo(new Cart());

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
        public async void GetUserCart_WhenUserDoesNotExist_ReturnsBadRequest()
        {
            User user = null;
            MockFindByIdAsyncOfUserManager(user);

            var result = await _controller.GetUserCart(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
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
            MockGetMenuItemFromMenuRepo(item);

            var result = await _controller.Create(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenMenuItemIsSoldOut_ReturnsBadRequest()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 0 });

            var result = await _controller.Create(new SaveCartResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Create_WhenAnonymousUserSentRequest_UserIdOfCartIsNotSetUp()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 1 });
            SetInitialUser(null);

            var result = await _controller.Create(new SaveCartResource()) as OkObjectResult;
            var value = result.Value as CartResource;

            Assert.Equal(0, value.UserId);
        }

        [Fact]
        public async void Create_WhenAdminSentRequest_UserIdOfCartIsNotSetUp()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 1 });
            SetInitialUser(1);
            MockIsInRoleAsyncOfUserManager(true);

            var result = await _controller.Create(new SaveCartResource()) as OkObjectResult;
            var value = result.Value as CartResource;

            Assert.Equal(0, value.UserId);
        }

        [Fact]
        public async void Create_WhenMenuItemIsValid_CartIsSaved()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 1 });
            SetInitialUser(1);
            MockIsInRoleAsyncOfUserManager(false);
            MockAddFromCartRepo();

            await _controller.Create(new SaveCartResource());

            _cartRepo.Verify(cr => cr.Add(It.IsAny<Cart>()));
        }

        [Fact]
        public async void Create_WhenMenuItemIsValid_ReturnsOkObjectResult()
        {
            MockGetMenuItemFromMenuRepo(new MenuItem { Available = 1 });
            SetInitialUser(1);
            MockIsInRoleAsyncOfUserManager(false);
            MockAddFromCartRepo();

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
            MockGetCartFromCartRepo(cart);

            var result = await _controller.Update(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserIsLoggedOut_ReturnsBadRequest()
        {
            MockGetCartFromCartRepo(new Cart());
            SetInitialUser(null);

            var result = await _controller.Update(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserIsAdmin_ReturnsBadRequest()
        {
            MockGetCartFromCartRepo(new Cart());
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(new User());
            MockIsInRoleAsyncOfUserManager(true);

            var result = await _controller.Update(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserCartIsNull_NewCartIsUpdatedAsUserCart()
        {
            Cart userCart = null;
            var newCart = new Cart();
            MockGetCartFromCartRepo(newCart);
            MockFindByIdAsyncOfUserManager(new User());
            MockIsInRoleAsyncOfUserManager(false);
            SetInitialUser(1);
            MockGetUserCartFromCartRepo(userCart);

            var result = await _controller.Update(It.IsAny<int>()) as OkObjectResult;

            Assert.Equal(1, newCart.UserId);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUserCartExists_NewCartItemsAreAddedToUserCart()
        {
            var cart = new Cart();
            var userCart = new Cart();
            MockGetCartFromCartRepo(cart);
            MockFindByIdAsyncOfUserManager(new User());
            MockIsInRoleAsyncOfUserManager(false);
            SetInitialUser(1);
            MockGetUserCartFromCartRepo(userCart);
            _cartRepo.Setup(cr => cr.Remove(cart));
            _cartRepo.Setup(cr => cr.AddCartItemsToAnotherCart(cart, userCart));

            var result = await _controller.Update(It.IsAny<int>()) as OkObjectResult;

            _cartRepo.Verify(cr => cr.Remove(cart));
            _cartRepo.Verify(cr => cr.AddCartItemsToAnotherCart(cart, userCart));
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
            MockGetCartFromCartRepo(cart);

            var result = await _controller.Remove(It.IsAny<int>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Remove_WhenCartExists_ReturnsBadRequest()
        {
            var cart = new Cart();
            MockGetCartFromCartRepo(cart);
            MockRemoveFromCartRepo(cart);

            var result = await _controller.Remove(It.IsAny<int>()) as OkResult;

            _cartRepo.Verify(cr => cr.Remove(cart));
            Assert.Equal(200, result.StatusCode);
        }

        private void MockGetCartFromCartRepo(Cart cart)
        {
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>(), It.IsAny<bool>()))
                .ReturnsAsync(cart);
        }

        private void MockGetUserCartFromCartRepo(Cart cart)
        {
            _cartRepo.Setup(cr => cr.GetUserCart(It.IsAny<int>()))
                .ReturnsAsync(cart);
        }

        private void MockGetMenuItemFromMenuRepo(MenuItem item)
        {
            _menuRepo.Setup(mr => mr.GetMenuItem(It.IsAny<int>()))
                .ReturnsAsync(item);
        }

        private void MockAddFromCartRepo()
        {
            _cartRepo.Setup(cr => cr.Add(It.IsAny<Cart>()));
        }

        private void MockIsInRoleAsyncOfUserManager(bool isInRole)
        {
            _userManager.Setup(um => um.IsInRoleAsync(It.IsAny<User>(), "Admin"))
                .ReturnsAsync(isInRole);
        }

        private void MockFindByIdAsyncOfUserManager(User user)
        {
            _userManager.Setup(um => um.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(user);
        }

        private void MockRemoveFromCartRepo(Cart cart)
        {
            _cartRepo.Setup(cr => cr.Remove(cart));
        }


        private void SetInitialUser(int? id)
        {
            var identity = new GenericIdentity("", "");
            var nameIdentifierClaim = new Claim(ClaimTypes.NameIdentifier, id.ToString());
            identity.AddClaim(nameIdentifierClaim);

            var fakeUser = new GenericPrincipal(identity, roles: new string[] { });
            var context = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = fakeUser
                }
            };

            _controller.ControllerContext = context;
        }
    }
}
