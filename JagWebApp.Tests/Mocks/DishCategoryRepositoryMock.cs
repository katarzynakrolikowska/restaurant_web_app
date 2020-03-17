using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;
using System.Collections.Generic;

namespace JagWebApp.Tests.Mocks
{
    class DishCategoryRepositoryMock
    {
        private Mock<IDishCategoryRepository> _dishCategoryRepo =
            new Mock<IDishCategoryRepository>();

        public DishCategoryRepositoryMock(Mock<IDishCategoryRepository> dishCategoryRepo)
        {
            _dishCategoryRepo = dishCategoryRepo;
        }

        public void MockGetCategories(ICollection<Category> categories)
        {
            _dishCategoryRepo.Setup(r => r.GetCategories())
                .ReturnsAsync(categories);
        }

        public void MockCategoryExists(bool exist)
        {
            _dishCategoryRepo.Setup(cr => cr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(exist);
        }

        public void VerifyGetCategories()
        {
            _dishCategoryRepo.Verify(r => r.GetCategories());
        }
    }
}
