using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class OrderRepositoryMock
    {
        private readonly Mock<IOrderRepository> _orderRepo;

        public OrderRepositoryMock(Mock<IOrderRepository> orderRepo)
        {
            _orderRepo = orderRepo;
        }

        public void MockAdd()
        {
            _orderRepo.Setup(or => or.Add(It.IsAny<Order>()));
        }

        public void VerifyAdd()
        {
            _orderRepo.Verify(or => or.Add(It.IsAny<Order>()));
        }
    }
}
