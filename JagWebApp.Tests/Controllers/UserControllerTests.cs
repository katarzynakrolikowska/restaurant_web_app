using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class UserControllerTests
    {
        private User _user;
        private readonly Mock<UserManager<User>> _userManager;
        private readonly Mock<ITokenRepository> _tokenRepo;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            _user = new User();

            var mockUserStore = new Mock<IUserStore<User>>();
            _userManager = new Mock<UserManager<User>>(mockUserStore.Object, null, null, null, null, null, null, null, null);
            _tokenRepo = new Mock<ITokenRepository>();
            _controller = new UserController(_userManager.Object, _tokenRepo.Object);
        }

        [Fact]
        public void ChangeEmail_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.ChangeEmail(It.IsAny<int>(), It.IsAny<UserForLoginResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void ChangeEmail_WhenUserExistsAndUpdatingIsSuccessful_ReturnsOkActionResult()
        {
            SetInitialMockingToReturnSuccessWhenEmailIsModified(It.IsAny<int>());

            var result = await _controller
                .ChangeEmail(It.IsAny<int>(), new UserForLoginResource()) as OkObjectResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenUserIsValid_UpdateMethodIsCalled()
        {
            SetInitialMockingToReturnSuccessWhenEmailIsModified(id: 1);
            _userManager.Setup(um => um.SetEmailAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
            _userManager.Setup(um => um.SetUserNameAsync(It.IsAny<User>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);

            await _controller.ChangeEmail(1, new UserForLoginResource());

            _userManager.Verify(um => um.SetEmailAsync(It.IsAny<User>(), It.IsAny<string>()));
            _userManager.Verify(um => um.SetUserNameAsync(It.IsAny<User>(), It.IsAny<string>()));
            _userManager.Verify(um => um.UpdateAsync(It.IsAny<User>()));
        }

        [Fact]
        public async void ChangeEmail_WhenUserExistsAndIsValid_ReturnsToken()
        {
            var tokenObject = new { token = "a" };
            SetInitialMockingToReturnSuccessWhenEmailIsModified(id: 1);
            _tokenRepo.Setup(tr => tr.GenerateToken(It.IsAny<User>()))
                .ReturnsAsync("a");

            var result = await _controller
                .ChangeEmail(1, new UserForLoginResource()) as ObjectResult;

            Assert.Equal(tokenObject.ToString(), result.Value.ToString());
        }

        [Fact]
        public async void ChangeEmail_WhenUserNotFound_ReturnsNotFoundResult()
        {
            User user = null;
            _userManager.Setup(um => um.FindByIdAsync("1"))
                .ReturnsAsync(user);

            var result = await _controller
                .ChangeEmail(1, new UserForLoginResource()) as NotFoundObjectResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenLoggedInUserIdIsNotEqualToPostedId_ReturnsUnauthorizedResult()
        {
            var loggedInUserId = 2;
            SetInitialUser(loggedInUserId);
            _userManager.Setup(um => um.FindByIdAsync("1"))
                .ReturnsAsync(new User());

            var result = await _controller
                .ChangeEmail(1, new UserForLoginResource()) as UnauthorizedObjectResult;

            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a"};
            SetInitialMockingForValidUser(id: 1);
            _userManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
               .ReturnsAsync(IdentityResult.Failed(identityError));

            var result = await _controller.ChangeEmail(1, new UserForLoginResource()) as ObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public void ChangePassword_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.ChangePassword(It.IsAny<int>(), It.IsAny<ChangePasswordViewModelResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void ChangePassword_WhenUserExistsAndUpdatingIsSuccessful_ReturnsOkActionResult()
        {
            SetInitialMockingToReturnSuccessWhenPasswordIsModifying(id: 1);

            var result = await _controller
                .ChangePassword(1, new ChangePasswordViewModelResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void ChangePassword_WhenUserExistsAndIsValid_ChangePasswordIsCalled()
        {
            var viewModel = new ChangePasswordViewModelResource()
            {
                CurrentPassword = "a",
                NewPassword = "b"
            };
            SetInitialMockingToReturnSuccessWhenPasswordIsModifying(id: 1);

            await _controller.ChangePassword(1, viewModel);

            _userManager.Verify(um => um.ChangePasswordAsync(_user, "a", "b"));
        }

        [Fact]
        public async void ChangePassword_WhenUserNotFound_ReturnsNotFoundResult()
        {
            User user = null;
            _userManager.Setup(um => um.FindByIdAsync("1"))
                .ReturnsAsync(user);

            var result = await _controller
                .ChangePassword(1, new ChangePasswordViewModelResource()) as NotFoundObjectResult;

            Assert.Equal(404, result.StatusCode);
        }

        [Fact]
        public async void ChangePassword_WhenLoggedInUserIdIsNotEqualToPostedId_ReturnsUnauthorizedResult()
        {
            var loggedInUserId = 2;
            SetInitialUser(loggedInUserId);
            _userManager.Setup(um => um.FindByIdAsync("1"))
                .ReturnsAsync(new User());

            var result = await _controller
                .ChangePassword(1, new ChangePasswordViewModelResource()) as UnauthorizedObjectResult;

            Assert.Equal(401, result.StatusCode);
        }

        [Fact]
        public async void ChangePassword_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            SetInitialMockingForValidUser(id: 1);
            _userManager.Setup(um => um.ChangePasswordAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
               .ReturnsAsync(IdentityResult.Failed(identityError));

            var result = await _controller
                .ChangePassword(1, new ChangePasswordViewModelResource()) as ObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        private void SetInitialMockingToReturnSuccessWhenEmailIsModified(int id)
        {
            SetInitialMockingForValidUser(id);

            _userManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(IdentityResult.Success);
        }

        private void SetInitialMockingToReturnSuccessWhenPasswordIsModifying(int id)
        {
            SetInitialMockingForValidUser(id);

            _userManager.Setup(um => 
                um.ChangePasswordAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(IdentityResult.Success);
        }

        private void SetInitialMockingForValidUser(int id)
        {
            SetInitialUser(id);

            _userManager.Setup(um => um.FindByIdAsync(id.ToString()))
                .ReturnsAsync(_user);
        }

        private void SetInitialUser(int id)
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
