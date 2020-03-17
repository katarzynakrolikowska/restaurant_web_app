using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class CartRepositoryMock
    {
        private Mock<ICartRepository> _cartRepo;

        public CartRepositoryMock(Mock<ICartRepository> cartRepo)
        {
            _cartRepo = cartRepo;
        }

        public void MockGetCart(Cart cart)
        {
            _cartRepo.Setup(cr => cr.GetCart(It.IsAny<int>(), It.IsAny<bool>()))
                .ReturnsAsync(cart);
        }

        public void MockGetUserCart(Cart cart)
        {
            _cartRepo.Setup(cr => cr.GetUserCart(It.IsAny<int>()))
                .ReturnsAsync(cart);
        }

        public void MockAdd()
        {
            _cartRepo.Setup(cr => cr.Add(It.IsAny<Cart>()));
        }

        public void MockRemove(Cart cart)
        {
            _cartRepo.Setup(cr => cr.Remove(cart));
        }

        public void MockRemove()
        {
            _cartRepo.Setup(cr => cr.Remove(It.IsAny<Cart>()));
        }

        public void MockAddCartItemsToAnotherCart(Cart cart, Cart anotherCart)
        {
            _cartRepo.Setup(cr => cr.AddCartItemsToAnotherCart(cart, anotherCart));
        }

        public void VerifyAdd()
        {
            _cartRepo.Verify(cr => cr.Add(It.IsAny<Cart>()));
        }

        public void VerifyRemove(Cart cart)
        {
            _cartRepo.Verify(cr => cr.Remove(cart));
        }

        public void VerifyAddCartItemsToAnotherCart(Cart cart, Cart anotherCart)
        {
            _cartRepo.Verify(cr => cr.AddCartItemsToAnotherCart(cart, anotherCart));
        }
    }
}
