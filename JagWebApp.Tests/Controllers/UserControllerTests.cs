using JagWebApp.Controllers;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using JagWebApp.Tests.Mocks;
using JagWebApp.Tests.Stubs;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<UserManager<User>> _userManager;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            var tokenRepo = TokenRepositoryMock.TokenRepoMock;

            _userManager = UserManagerMock.UserManager;
            _controller = new UserController(_userManager.Object, tokenRepo.Object);
        }

        [Fact]
        public void ChangeEmail_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.ChangeEmail(It.IsAny<JsonPatchDocument<User>>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void ChangeEmail_WhenUserIsLoggedOut_ReturnsBadRequestResult()
        {
            UserStub.SetUser(null, _controller);

            var result = await _controller.ChangeEmail(new JsonPatchDocument<User>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenInputIsNull_ReturnsBadRequestResult()
        {
            UserStub.SetUser(1, _controller);

            var result = await _controller.ChangeEmail(null) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockUpdateAsync(IdentityResult.Failed(identityError));

            var result = await _controller.ChangeEmail(new JsonPatchDocument<User>()) as ObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public async void ChangeEmail_WhenUserIsLoggedInAndInputIsValid_UpdateMethodIsCalled()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockUpdateAsync(IdentityResult.Success);

            await _controller.ChangeEmail(new JsonPatchDocument<User>());

            _userManager.Verify(um => um.UpdateAsync(It.IsAny<User>()));
        }

        [Fact]
        public async void ChangeEmail_WhenUserExistsAndIsValid_ReturnsToken()
        {
            var tokenObj = new { token = "a" };
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockUpdateAsync(IdentityResult.Success);
            TokenRepositoryMock.MockGenerateToken("a");

            var result = await _controller
                .ChangeEmail(new JsonPatchDocument<User>()) as OkObjectResult;

            Assert.Equal(tokenObj.ToString(), result.Value.ToString());
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void ChangePassword_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.ChangePassword(It.IsAny<ChangePasswordViewModelResource>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void ChangePassword_WhenUserIsLoggedOut_ReturnsBadRequestResultResult()
        {
            UserStub.SetUser(null, _controller);

            var result = await _controller.ChangePassword(new ChangePasswordViewModelResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void ChangePassword_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockChangePasswordAsync(IdentityResult.Failed(identityError));

            var result = await _controller.ChangePassword(new ChangePasswordViewModelResource()) as BadRequestObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public async void ChangePassword_WhenUserExistsAndIsValid_ChangePasswordIsCalled()
        {
            var viewModel = new ChangePasswordViewModelResource()
            {
                CurrentPassword = "a",
                NewPassword = "b"
            };
            var user = new User();
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(user);
            UserManagerMock.MockChangePasswordAsync(IdentityResult.Success);

            await _controller.ChangePassword(viewModel);

            _userManager.Verify(um => um.ChangePasswordAsync(user, "a", "b"));
        }

        [Fact]
        public async void ChangePassword_WhenUserIsLoggedInAndUpdatingIsSuccessful_ReturnsOkActionResult()
        {
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockChangePasswordAsync(IdentityResult.Success);

            var result = await _controller
                .ChangePassword(new ChangePasswordViewModelResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }
    }
}
