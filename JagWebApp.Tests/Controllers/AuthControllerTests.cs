using AutoMapper;
using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class AuthControllerTests
    {
        private readonly IMapper _mapper;
        private readonly Mock<UserManager<User>> _userManager;
        private readonly Mock<SignInManager<User>> _signInManager;
        private readonly Mock<ITokenRepository> _tokenRepository;
        private readonly AuthController _controller;
        public AuthControllerTests()
        {
            _mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();

            var userStore = new Mock<IUserStore<User>>();
            _userManager = new Mock<UserManager<User>>(userStore.Object, null, null, null, null, null, null, null, null);

            var _contextAccessor = new Mock<IHttpContextAccessor>();
            var _userPrincipalFactory = new Mock<IUserClaimsPrincipalFactory<User>>();

            _signInManager = new Mock<SignInManager<User>>(_userManager.Object,
               _contextAccessor.Object, _userPrincipalFactory.Object, null, null, null, null);

            _tokenRepository = new Mock<ITokenRepository>();

            _controller = new AuthController(_mapper, _userManager.Object, _signInManager.Object, 
                _tokenRepository.Object);
        }

        [Fact]
        public void Register_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Register(It.IsAny<UserForRegisterResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Register_WhenCalled_CreateAsyncIsCalled()
        {
            _userManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            await _controller.Register(new UserForRegisterResource());

            _userManager.Verify(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()));
        }

        [Fact]
        public async void Register_WhenResultSucceeded_ReturnsOkResult()
        {
            _userManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
               .ReturnsAsync(IdentityResult.Success);

            var result = await _controller.Register(new UserForRegisterResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Register_WhenResultFailed_ReturnsBadRequestObjectResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            _userManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
               .ReturnsAsync(IdentityResult.Failed(identityError));

            var result = await _controller.Register(new UserForRegisterResource()) as BadRequestObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public void Login_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Login(It.IsAny<UserForLoginResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Login_WhenCalled_CheckPasswordSignInAsyncIsCalled()
        {
            var user = new User() { Email = "a" };
            var userForLoginResource = new UserForLoginResource() { Email = "a", Password = "b" };
            _userManager.Setup(um => um.FindByEmailAsync("a"))
                .ReturnsAsync(user);
            _signInManager.Setup(sm => sm.CheckPasswordSignInAsync(user, "b", false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            await _controller.Login(userForLoginResource);

            _signInManager.Verify(sm => sm.CheckPasswordSignInAsync(user, "b", false));
        }

        [Fact]
        public async void Login_WhenCheckPasswordSignInReturnsSuccess_ReturnsOkObjectResultWithToken()
        {
            var token = new { token = "a" };
            _userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(It.IsAny<User>());
            _tokenRepository.Setup(tr => tr.GenerateToken(It.IsAny<User>()))
                .ReturnsAsync("a");
            _signInManager.Setup(sm => sm.CheckPasswordSignInAsync(It.IsAny<User>(), It.IsAny<string>(), false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

            var result = await _controller.Login(new UserForLoginResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
            Assert.Equal(token.ToString(), result.Value.ToString());
        }

        [Fact]
        public async void Login_WhenResultFailed_ReturnsUnauthorizedResult()
        {
            _userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync(It.IsAny<User>());
            _signInManager.Setup(sm => sm.CheckPasswordSignInAsync(It.IsAny<User>(), It.IsAny<string>(), false))
                .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Failed);

            var result = await _controller.Login(new UserForLoginResource()) as UnauthorizedResult;

            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public void UserExists_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.UserExists(It.IsAny<string>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void UserExists_WhenUserIsNotFound_ReturnsOkObjectResultContainsTrue()
        {
            User user = null;
            _userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
                  .ReturnsAsync(user);

            var result = await _controller.UserExists(It.IsAny<string>()) as OkObjectResult;

            Assert.Equal(false, result.Value);
        }

        [Fact]
        public async void UserExists_WhenUserIsFound_ReturnsOkObjectResultContainsTrue()
        {
            _userManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
                  .ReturnsAsync(new User());

            var result = await _controller.UserExists(It.IsAny<string>()) as OkObjectResult;

            Assert.Equal(true, result.Value);
        }
    }

}
