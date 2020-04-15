using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;
using System.Collections.Generic;

namespace JagWebApp.Tests.Mocks
{
    class OrderRepositoryMock
    {
        private readonly Mock<IOrderRepository> _orderRepo;

        public OrderRepositoryMock(Mock<IOrderRepository> orderRepo)
        {
            _orderRepo = orderRepo;
        }

        public void MockGetOrders()
        {
            _orderRepo.Setup(or => or.GetOrders())
                .ReturnsAsync(new List<Order>());
        }

        public void MockGetUserOrders()
        {
            _orderRepo.Setup(or => or.GetUserOrders(It.IsAny<int>()))
                .ReturnsAsync(new List<Order>());
        }

        public void MockGetOrder(Order order)
        {
            _orderRepo.Setup(or => or.GetOrder(It.IsAny<int>()))
                .ReturnsAsync(order);
        }

        public void MockGetUserOrder(Order order)
        {
            _orderRepo.Setup(or => or.GetUserOrder(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(order);
        }

        public void MockAdd()
        {
            _orderRepo.Setup(or => or.Add(It.IsAny<Order>()));
        }

        public void VerifyGetOrder()
        {
            _orderRepo.Verify(or => or.GetOrder(It.IsAny<int>()));
        }

        public void VerifyGetUserOrder()
        {
            _orderRepo.Verify(or => or.GetUserOrder(It.IsAny<int>(), It.IsAny<int>()));
        }

        public void VerifyAdd()
        {
            _orderRepo.Verify(or => or.Add(It.IsAny<Order>()));
        }
    }
}
