using JagWebApp.Core.Models;
using JagWebApp.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IDishRepository
    {
        Task<Dish> GetDish(int id);

        Task<IEnumerable<Dish>> GetDishes();

        void Add(Dish dish);

        void Remove(Dish dish);
    }
}