using JagWebApp.Core.Models;

namespace JagWebApp.Tests.Stubs
{
    class DishStub
    {
        public static Dish GetDish()
        {
            return new Dish
            {
                Id = 1,
                Name = "a",
                Category = new Category { Id = 1, Name = "a" },
                Amount = 2
            };
        }
    }
}
