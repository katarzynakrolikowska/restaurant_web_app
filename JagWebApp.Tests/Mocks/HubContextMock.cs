using JagWebApp.Hubs;
using Microsoft.AspNetCore.SignalR;
using Moq;
using System.Threading;

namespace JagWebApp.Tests.Mocks
{
    class HubContextMock
    {
        public static Mock<IHubContext<MenuItemHub>> Hub = new Mock<IHubContext<MenuItemHub>>();

        public static void MockHub()
        {
            Mock<IClientProxy> mockClientProxy = new Mock<IClientProxy>();
            Mock<IHubClients> mockClients = new Mock<IHubClients>();
            Mock<IGroupManager> mockGroups = new Mock<IGroupManager>();

            mockClients.Setup(clients => clients.All).Returns(mockClientProxy.Object);

            CancellationToken cancellationToken = default;
            mockGroups.Object.AddToGroupAsync("1234", "DataGroup", cancellationToken);

            Hub.Setup(x => x.Clients.All).Returns(mockClientProxy.Object);
            Hub.Setup(groups => groups.Groups).Returns(mockGroups.Object);
        }
    }
}
