using JagWebApp.Core;
using Moq;

namespace JagWebApp.Tests.Mocks
{
    class UnitOfWorkMock
    {
        private Mock<IUnitOfWork> _unitOfWork;

        public UnitOfWorkMock(Mock<IUnitOfWork> unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public void MockCompleteAsync()
        {
            _unitOfWork.Setup(uow => uow.CompleteAsync());
        }

        public void VerifyCompleteAsync()
        {
            _unitOfWork.Verify(uow => uow.CompleteAsync());
        }
    }
}
