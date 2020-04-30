using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IDishRepository
    {
        Task<Dish> GetDishAsync(int id);

        Task<IEnumerable<Dish>> GetDishesAsync();

        void Add(Dish dish);

        void Remove(Dish dish);

        Task<bool> DishesExistAsync(IEnumerable<int> idsDishes);
    }
}