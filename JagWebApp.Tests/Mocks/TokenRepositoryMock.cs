using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class TokenRepositoryMock
    {
        public static Mock<ITokenRepository> TokenRepoMock = new Mock<ITokenRepository>();

        public static void MockGenerateToken(string token)
        {
            TokenRepoMock.Setup(tr => tr.GenerateToken(It.IsAny<User>()))
                .ReturnsAsync(token);
        }
    }
}
