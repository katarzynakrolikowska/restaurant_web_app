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
            _dishCategoryRepo.Setup(dcr => dcr.GetCategories())
                .ReturnsAsync(categories);
        }

        public void MockGetCategory(Category category)
        {
            _dishCategoryRepo.Setup(dcr => dcr.GetCategory(It.IsAny<int>()))
                .ReturnsAsync(category);
        }

        public void MockAdd()
        {
            _dishCategoryRepo.Setup(dcr => dcr.Add(It.IsAny<Category>()));
        }

        public void MockRemove()
        {
            _dishCategoryRepo.Setup(dcr => dcr.Remove(It.IsAny<Category>()));
        }

        public void MockCategoryExists(bool exist)
        {
            _dishCategoryRepo.Setup(dcr => dcr.CategoryExists(It.IsAny<int>()))
                .ReturnsAsync(exist);
        }

        public void MockDishWithCategoryExists(bool exist)
        {
            _dishCategoryRepo.Setup(dcr => dcr.DishWithCategoryExists(It.IsAny<int>()))
                .ReturnsAsync(exist);
        }

        public void VerifyGetCategories()
        {
            _dishCategoryRepo.Verify(dcr => dcr.GetCategories());
        }

        public void VerifyAdd()
        {
            _dishCategoryRepo.Verify(dcr => dcr.Add(It.IsAny<Category>()));
        }

        public void VerifyRemove()
        {
            _dishCategoryRepo.Verify(dcr => dcr.Remove(It.IsAny<Category>()));
        }
    }
}
