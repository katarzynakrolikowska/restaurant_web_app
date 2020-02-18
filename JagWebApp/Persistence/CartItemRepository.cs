using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class CartItemRepository : ICartItemRepository
    {
        private readonly JagDbContext _context;

        public CartItemRepository(JagDbContext context)
        {
            _context = context;
        }

        

        public async Task<CartItem> GetCartItem(int cartId, int menuItemId)
        {
            return await _context.CartItems
                .Where(ci => ci.CartId == cartId)
                .SingleOrDefaultAsync(ci => ci.MenuItemId == menuItemId);
        }

        public void Add(Cart cart, int menuItemId)
        {
            var item = new CartItem { MenuItemId = menuItemId, Amount = 1 };
            cart.Items.Add(item);
        }

        public void Remove(Cart cart, CartItem item)
        {
            cart.Items.Remove(item);
        }
    }
}
