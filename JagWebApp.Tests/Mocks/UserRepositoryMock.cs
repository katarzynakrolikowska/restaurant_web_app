using JagWebApp.Core;
using JagWebApp.Core.Models.Identity;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class UserRepositoryMock
    {
        private readonly Mock<IUserRepository> _userRepo;

        public UserRepositoryMock(Mock<IUserRepository> userRepo)
        {
            _userRepo = userRepo;
        }

        public void MockGetUser()
        {
            _userRepo.Setup(ur => ur.GetUserAsync(It.IsAny<int>()))
                .ReturnsAsync(new User());
        }
    }
}
