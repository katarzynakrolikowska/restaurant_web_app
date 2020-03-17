using JagWebApp.Core.Models;
using Microsoft.AspNetCore.Identity;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class UserManagerMock
    {
        private static Mock<IUserStore<User>> _userStore = new Mock<IUserStore<User>>();

        public static Mock<UserManager<User>> UserManager = 
            new Mock<UserManager<User>>(_userStore.Object, null, null, null, null, null, null, null, null);

        public static void MockCreateAsync(IdentityResult result)
        {
            UserManager.Setup(um => um.CreateAsync(It.IsAny<User>(), It.IsAny<string>()))
               .ReturnsAsync(result);
        }

        public static void MockFindByEmailAsync(User user)
        {
            UserManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
               .ReturnsAsync(user);
        }

        public static void MockFindByEmailAsync()
        {
            UserManager.Setup(um => um.FindByEmailAsync(It.IsAny<string>()))
               .ReturnsAsync(It.IsAny<User>());
        }

        public static void MockFindByIdAsync(User user)
        {
            UserManager.Setup(um => um.FindByIdAsync(It.IsAny<string>()))
                .ReturnsAsync(user);
        }

        public static void MockUpdateAsync(IdentityResult result)
        {
            UserManager.Setup(um => um.UpdateAsync(It.IsAny<User>()))
                .ReturnsAsync(result);
        }

        public static void MockChangePasswordAsync(IdentityResult result)
        {
            UserManager.Setup(um => um.ChangePasswordAsync(It.IsAny<User>(), It.IsAny<string>(), It.IsAny<string>()))
               .ReturnsAsync(result);
        }

        public static void MockIsInAdminRoleAsync(bool isInRole)
        {
            UserManager.Setup(um => um.IsInRoleAsync(It.IsAny<User>(), "Admin"))
                .ReturnsAsync(isInRole);
        }
    }
}
