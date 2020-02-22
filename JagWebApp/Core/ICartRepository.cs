using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface ICartRepository
    {
        Task<IEnumerable<Cart>> GetCarts();

        Task<Cart> GetCart(int id, bool includeRelated = true);

        Task<Cart> GetUserCart(int userId);

        void Add(Cart cart);

        void AddCartItemsToAnotherCart(Cart cart, Cart anotherCart);

        void Remove(Cart cart);
    }
}