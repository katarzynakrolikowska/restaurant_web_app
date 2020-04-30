using JagWebApp.Core;
using JagWebApp.Core.Models;
using Moq;
using System.Collections.Generic;

namespace JagWebApp.Tests.Mocks
{
    class DishRepositoryMock
    {
        private Mock<IDishRepository> _dishRepo;

        public DishRepositoryMock(Mock<IDishRepository> dishRepo)
        {
            _dishRepo = dishRepo;
        }

        public void MockGetDishes(IEnumerable<Dish> dishes)
        {
            _dishRepo.Setup(dr => dr.GetDishesAsync())
                .ReturnsAsync(dishes);
        }

        public void MockGetDishes()
        {
            _dishRepo.Setup(dr => dr.GetDishesAsync())
                .ReturnsAsync(It.IsAny<IEnumerable<Dish>>);
        }

        public void MockGetDish(Dish dish)
        {
            _dishRepo.Setup(dr => dr.GetDishAsync(It.IsAny<int>()))
                .ReturnsAsync(dish);
        }

        public void MockDishesExist(bool exist)
        {
            _dishRepo.Setup(dr => dr.DishesExistAsync(It.IsAny<IEnumerable<int>>()))
                .ReturnsAsync(exist);
        }

        public void VerifyGetDishes()
        {
            _dishRepo.Verify(dr => dr.GetDishesAsync());
        }

        public void VerifyGetDish()
        {
            _dishRepo.Verify(dr => dr.GetDishAsync(It.IsAny<int>()));
        }

        public void VerifyAdd(Dish dish)
        {
            _dishRepo.Verify(dr => dr.Add(dish));
        }

        public void VerifyAdd()
        {
            _dishRepo.Verify(dr => dr.Add(It.IsAny<Dish>()));
        }

        public void VerifyRemove(Dish dish)
        {
            _dishRepo.Verify(dr => dr.Remove(dish));
        }
    }
}
