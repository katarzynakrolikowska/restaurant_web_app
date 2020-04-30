using JagWebApp.Core.Models.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class SignInManagerMock
    {
        private static Mock<IHttpContextAccessor> _contextAccessor = new Mock<IHttpContextAccessor>();
        private static Mock<IUserClaimsPrincipalFactory<User>> _userPrincipalFactory = 
            new Mock<IUserClaimsPrincipalFactory<User>>();

        public static Mock<SignInManager<User>> SignInManager = new Mock<SignInManager<User>>(
            UserManagerMock.UserManager.Object, 
            _contextAccessor.Object, 
            _userPrincipalFactory.Object, 
            null, 
            null, 
            null, 
            null);

        public static void MockCheckPasswordSignInAsync(User user, string password, SignInResult result)
        {
           SignInManager.Setup(sm => sm.CheckPasswordSignInAsync(user, password, false))
                .ReturnsAsync(result);
        }

        public static void MockCheckPasswordSignInAsync(SignInResult result)
        {
            SignInManager.Setup(sm => sm.CheckPasswordSignInAsync(It.IsAny<User>(), It.IsAny<string>(), false))
                 .ReturnsAsync(result);
        }
    }
}
