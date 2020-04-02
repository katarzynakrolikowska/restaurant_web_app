using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetMenuItems();

        Task<MenuItem> GetMenuItem(int id);

        Task<MenuItem> GetMainMenuItem();

        Task<MenuItem> GetMenuItemWithDish(int dishId);

        void Add(MenuItem menuItem);

        void Remove(MenuItem menuItem);

        Task UpdateAvailability(ICollection<CartItem> cartItems);
    }
}