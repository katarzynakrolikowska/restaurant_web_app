using JagWebApp.Controllers;
using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Principal;
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
            var mockUserStore = new Mock<IUserStore<User>>();
            _userManager = new Mock<UserManager<User>>(mockUserStore.Object, null, null, null, null, null, null, null, null);
            _tokenRepo = new Mock<ITokenRepository>();
            _controller = new UserController(_userManager.Object, _tokenRepo.Object);
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
            SetInitialUser(null);

            var result = await _controller
                .ChangeEmail(new JsonPatchDocument<User>()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenInputIsNull_ReturnsBadRequestResult()
        {
            SetInitialUser(1);

            var result = await _controller
                .ChangeEmail(null) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void ChangeEmail_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(new User());
            MockUpdateAsyncOfUserManager(IdentityResult.Failed(identityError));

            var result = await _controller.ChangeEmail(new JsonPatchDocument<User>()) as ObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public async void ChangeEmail_WhenUserIsLoggedInAndInputIsValid_UpdateMethodIsCalled()
        {
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(new User());
            MockUpdateAsyncOfUserManager(IdentityResult.Success);

            await _controller.ChangeEmail(new JsonPatchDocument<User>());

            _userManager.Verify(um => um.UpdateAsync(It.IsAny<User>()));
        }

        [Fact]
        public async void ChangeEmail_WhenUserExistsAndIsValid_ReturnsToken()
        {
            var tokenObj = new { token = "a" };
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(new User());
            MockUpdateAsyncOfUserManager(IdentityResult.Success);
            MockGenerateTokenFromTokenRepo("a");

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
            SetInitialUser(null);

            var result = await _controller
                .ChangePassword(new ChangePasswordViewModelResource()) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void ChangePassword_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(new User());
            MockChangePasswordAsyncOfUserManager(IdentityResult.Failed(identityError));


            var result = await _controller
                .ChangePassword(new ChangePasswordViewModelResource()) as BadRequestObjectResult;
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
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(user);
            MockChangePasswordAsyncOfUserManager(IdentityResult.Success);

            await _controller.ChangePassword(viewModel);

            _userManager.Verify(um => um.ChangePasswordAsync(user, "a", "b"));
        }

        [Fact]
        public async void ChangePassword_WhenUserIsLoggedInAndUpdatingIsSuccessful_ReturnsOkActionResult()
        {
            SetInitialUser(1);
            MockFindByIdAsyncOfUserManager(new User());
            MockChangePasswordAsyncOfUserManager(IdentityResult.Success);


            var result = await _controller
                .ChangePassword(new ChangePasswordViewModelResource()) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        private void MockUpdateAsyncOfUserManager(IdentityResult result)
        {
            _userManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(result);
        }

        private void MockFindByIdAsyncOfUserManager(User user)
        {
            _userManager.Setup(um => um.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(user);
        }

        private void MockGenerateTokenFromTokenRepo(string token)
        {
            _tokenRepo.Setup(tr => tr.GenerateToken(It.IsAny<User>()))
               .ReturnsAsync(token);
        }

        private void MockChangePasswordAsyncOfUserManager(IdentityResult result)
        {
            _userManager
               .Setup(um => um.ChangePasswordAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
               .ReturnsAsync(result);
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
