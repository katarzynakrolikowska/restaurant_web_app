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
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace JagWebApp.Tests.Controllers
{
    public class UserControllerTests
    {
        private readonly Mock<UserManager<User>> _userManager;
        private readonly AddressRepositoryMock _addressRepositoryMock;
        private readonly UserRepositoryMock _userRepositoryMock;
        private readonly UserController _controller;

        public UserControllerTests()
        {
            var tokenRepo = TokenRepositoryMock.TokenRepoMock;
            var addressRepo = new Mock<IAddressRepository>();
            var userRepo = new Mock<IUserRepository>();
            var unitOfWork = new Mock<IUnitOfWork>();
            var mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
            _userManager = UserManagerMock.UserManager;

            _controller = new UserController(
                _userManager.Object, 
                tokenRepo.Object, 
                addressRepo.Object,
                userRepo.Object,
                unitOfWork.Object, 
                mapper);

            _addressRepositoryMock = new AddressRepositoryMock(addressRepo);
            _userRepositoryMock = new UserRepositoryMock(userRepo);
        }

        [Fact]
        public async void GetUser_WhenCalled_ReturnsOkObjectResult()
        {
            UserStub.SetUser(1, _controller);
            _userRepositoryMock.MockGetUser();

            var result = await _controller.GetUser() as OkObjectResult;

            Assert.IsType<UserCustomerResource>(result.Value);
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void Update_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.Update(It.IsAny<JsonPatchDocument<UpdateUserResource>>());

            Assert.IsType<Task<IActionResult>>(result);
        }

        [Fact]
        public async void Update_WhenInputIsNull_ReturnsBadRequestResult()
        {
            UserStub.SetUser(1, _controller);

            var result = await _controller.Update(null) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenDeliveryDataIsUpdatingAndUserIsAdmin_ReturnsBadRequestResult()
        {
            var patchUser = new JsonPatchDocument<UpdateUserResource>().Replace(u => u.PhoneNumber, It.IsAny<string>());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(true);

            var result = await _controller.Update(patchUser) as BadRequestResult;

            Assert.Equal(400, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenUpdatingFailed_ReturnsBadRequestResult()
        {
            var identityError = new IdentityError() { Code = "400", Description = "a" };
            var patchUser = new JsonPatchDocument<UpdateUserResource>().Replace(u => u.PhoneNumber, It.IsAny<string>());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserManagerMock.MockUpdateAsync(IdentityResult.Failed(identityError));
            ObjectModelValidatorMock.SetObjectValidator(_controller);

            var result = await _controller.Update(patchUser) as ObjectResult;
            var errors = result.Value as List<IdentityError>;

            Assert.Equal(400, result.StatusCode);
            Assert.Equal("a", errors[0].Description);
        }

        [Fact]
        public async void Update_WhenInputIsValid_UpdateMethodIsCalled()
        {
            var patchUser = new JsonPatchDocument<UpdateUserResource>().Replace(u => u.PhoneNumber, It.IsAny<string>());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserManagerMock.MockUpdateAsync(IdentityResult.Success);
            ObjectModelValidatorMock.SetObjectValidator(_controller);

            await _controller.Update(patchUser);

            _userManager.Verify(um => um.UpdateAsync(It.IsAny<User>()));
        }

        [Fact]
        public async void Update_WhenEmailIsUpdating_ReturnsToken()
        {
            var tokenObj = new { token = "a" };
            var patchUser = new JsonPatchDocument<UpdateUserResource>().Replace(u => u.Email, It.IsAny<string>());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserManagerMock.MockUpdateAsync(IdentityResult.Success);
            TokenRepositoryMock.MockGenerateToken("a");
            ObjectModelValidatorMock.SetObjectValidator(_controller);

            var result = await _controller.Update(patchUser) as OkObjectResult;

            Assert.Equal(tokenObj.ToString(), result.Value.ToString());
            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public async void Update_WhenDeliveryDataIsUpdating_ReturnsOkResult()
        {
            var patchUser = new JsonPatchDocument<UpdateUserResource>().Replace(u => u.PhoneNumber, It.IsAny<string>());
            UserStub.SetUser(1, _controller);
            UserManagerMock.MockFindByIdAsync(new User());
            UserManagerMock.MockIsInAdminRoleAsync(false);
            UserManagerMock.MockUpdateAsync(IdentityResult.Success);
            _addressRepositoryMock.MockRemove();
            ObjectModelValidatorMock.SetObjectValidator(_controller);

            var result = await _controller.Update(patchUser) as OkResult;

            Assert.Equal(200, result.StatusCode);
        }

        [Fact]
        public void ChangePassword_WhenCalled_ReturnsIActionResult()
        {
            var result = _controller.ChangePassword(It.IsAny<ChangePasswordViewModelResource>());

            Assert.IsType<Task<IActionResult>>(result);
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
