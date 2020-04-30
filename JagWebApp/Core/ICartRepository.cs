using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface ICartRepository
    {
        Task<IEnumerable<Cart>> GetCartsAsync();

        Task<Cart> GetCartAsync(int id, bool includeRelated = true);

        Task<Cart> GetUserCartAsync(int userId);

        void Add(Cart cart);

        void AddCartItemsToAnotherCart(Cart cart, Cart anotherCart);

        Task UpdateCartItemAmountOfMenuItemAsync(MenuItem item);

        void Remove(Cart cart);
    }
}