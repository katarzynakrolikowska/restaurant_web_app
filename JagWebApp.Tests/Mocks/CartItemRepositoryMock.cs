using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class CartItemRepositoryMock
    {
        private Mock<ICartItemRepository> _cartItemRepo = new Mock<ICartItemRepository>();

        public CartItemRepositoryMock(Mock<ICartItemRepository> cartItemRepo)
        {
            _cartItemRepo = cartItemRepo;
        }

        public void MockGetCartItem(CartItem item)
        {
            _cartItemRepo.Setup(cir => cir.GetCartItem(It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(item);
        }

        public void MockAdd()
        {
            _cartItemRepo.Setup(cir => cir.Add(It.IsAny<Cart>(), It.IsAny<int>()));
        }

        public void MockRemove()
        {
            _cartItemRepo.Setup(cir => cir.Remove(It.IsAny<Cart>(), It.IsAny<CartItem>()));
        }

        public void VerifyAdd()
        {
            _cartItemRepo.Verify(cir => cir.Add(It.IsAny<Cart>(), It.IsAny<int>()));
        }

        public void VerifyRemove()
        {
            _cartItemRepo.Verify(cir => cir.Remove(It.IsAny<Cart>(), It.IsAny<CartItem>()));
        }
    }
}
