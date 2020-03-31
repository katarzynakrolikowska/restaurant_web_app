using JagWebApp.Core;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class AddressRepositoryMock
    {
        private readonly Mock<IAddressRepository> _addressRepo;

        public AddressRepositoryMock(Mock<IAddressRepository> addressRepo)
        {
            _addressRepo = addressRepo;
        }

        public void MockRemove()
        {
            _addressRepo.Setup(ar => ar.Remove(It.IsAny<int>()));
        }
    }
}
