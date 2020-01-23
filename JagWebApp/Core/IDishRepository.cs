using JagWebApp.Core.Models;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IDishRepository
    {
        Task<Dish> GetDish(int id);

        void Add(Dish dish);
    }
}