using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface ICartItemRepository
    {
        Task<CartItem> GetCartItem(int cartId, int menuItemId);

        void Add(Cart cart, int menuItemId);

        void Remove(Cart cart, CartItem item);
    }
}