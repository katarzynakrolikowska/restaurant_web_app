using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface ICartItemRepository
    {
        Task<IEnumerable<CartItem>> GetCartItems(int cartId);

        Task<CartItem> GetCartItem(int cartId, int menuItemId);

        int GetCartItemsCount(int cartId);

        void Add(CartItem cartItem);
    }
}