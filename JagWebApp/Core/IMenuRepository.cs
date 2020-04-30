using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetMenuItemsAsync();

        Task<MenuItem> GetMenuItemAsync(int id);

        Task<MenuItem> GetMainMenuItemAsync();

        Task<MenuItem> GetMenuItemWithDishAsync(int dishId);

        void Add(MenuItem menuItem);

        void Remove(MenuItem menuItem);

        Task<IEnumerable<MenuItem>> UpdateAvailabilityAsync(IEnumerable<CartItem> cartItems);
    }
}