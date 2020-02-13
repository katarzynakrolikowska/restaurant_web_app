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

        public async Task<IEnumerable<CartItem>> GetCartItems(int cartId)
        {
            return await _context.CartItems
                .Where(ci => ci.CartId == cartId)
                .ToListAsync();
        }

        public async Task<CartItem> GetCartItem(int cartId, int menuItemId)
        {
            return await _context.CartItems
                .Where(ci => ci.CartId == cartId)
                .SingleOrDefaultAsync(ci => ci.MenuItemId == menuItemId);
        }

        public int GetCartItemsCount(int cartId)
        {
            return _context.CartItems
                .Where(ci => ci.CartId == cartId)
                .Sum(ci => ci.Amount);
        }

        public void Add(CartItem cartItem)
        {
            _context.CartItems.Add(cartItem);
        }

       
    }
}
