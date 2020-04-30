using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.UserResources;
using JagWebApp.Tests.Mocks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly Mock<UserManager<User>> _userManager;
        private readonly Mock<SignInManager<User>> _signInManager;
        private readonly AuthController _controller;

        public AuthControllerTests()
        {
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            var tokenRepo = TokenRepositoryMock.TokenRepoMock;

            _userManager = UserManagerMock.UserManager;
            _signInManager = SignInManagerMock.SignInManager;

            _controller = new AuthController(mapper, _userManager.Object, _signInManager.Object, tokenRepo.Object);
        }

        [Fact]
        public void RegisterAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.RegisterAsync(It.IsAny<UserForRegisterResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void RegisterAsync_WhenCalled_CreateAsyncIsCalled()
        {
            UserManagerMock.MockCreateAsync(IdentityResult.Success);

            await _controller.RegisterAsync(new UserForRegisterResource());

            _userManager.Verify(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()));
        }

        [Fact]
        public async void RegisterAsync_WhenResultSucceeded_ReturnsOkResult()
        {
            UserManagerMock.MockCreateAsync(IdentityResult.Success);

            var result = await _controller.RegisterAsync(new UserForRegisterResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void RegisterAsync_WhenResultFailed_ReturnsBadRequestObjectResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            UserManagerMock.MockCreateAsync(IdentityResult.Failed(identityError));

            var result = await _controller.RegisterAsync(new UserForRegisterResource()) as BadRequestObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public void LoginAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.LoginAsync(It.IsAny<UserForLoginResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void LoginAsync_WhenUserEmailIsInvalid_ReturnsUnauthorizedResult()
        {
            User user = null;
            UserManagerMock.MockFindByEmailAsync(user);

            var result = await _controller.LoginAsync(new UserForLoginResource()) as UnauthorizedResult;

            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void LoginAsync_WhenCalled_CheckPasswordSignInAsyncIsCalled()
        {
            var user = new User();
            UserManagerMock.MockFindByEmailAsync(user);
            var userForLoginResource = new UserForLoginResource() { Password = "b" };
            SignInManagerMock.MockCheckPasswordSignInAsync(
                user, 
                "b", 
                Microsoft.AspNetCore.Identity.SignInResult.Success);

            await _controller.LoginAsync(userForLoginResource);

            _signInManager.Verify(sm => sm.CheckPasswordSignInAsync(user, "b", false));
        }

        [Fact]
        public async void LoginAsync_WhenCheckPasswordSignInReturnsSuccess_ReturnsOkObjectResultWithToken()
        {
            var token = new { token = "a" };
            TokenRepositoryMock.MockGenerateToken("a");
            UserManagerMock.MockFindByEmailAsync(new User());
            SignInManagerMock.MockCheckPasswordSignInAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            var result = await _controller.LoginAsync(new UserForLoginResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.Equal(token.ToString(), result.Value.ToString());
        }

        [Fact]
        public async void LoginAsync_WhenResultFailed_ReturnsUnauthorizedResult()
        {
            UserManagerMock.MockFindByEmailAsync();
            SignInManagerMock.MockCheckPasswordSignInAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            var result = await _controller.LoginAsync(new UserForLoginResource()) as UnauthorizedResult;

            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public void UserExistsAsync_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UserExistsAsync(It.IsAny<string>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UserExistsAsync_WhenUserIsNotFound_ReturnsOkObjectResultContainsTrue()
        {
            User user = null;
            UserManagerMock.MockFindByEmailAsync(user);

            var result = await _controller.UserExistsAsync(It.IsAny<string>()) as OkObjectResult;

            Assert.Equal(false, result.Value);
        }

        [Fact]
        public async void UserExistsAsync_WhenUserIsFound_ReturnsOkObjectResultContainsTrue()
        {
            UserManagerMock.MockFindByEmailAsync(new User());

            var result = await _controller.UserExistsAsync(It.IsAny<string>()) as OkObjectResult;

            Assert.Equal(true, result.Value);
        }
    }
}
