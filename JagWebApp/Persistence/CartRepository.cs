using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class CartRepository : ICartRepository
    {
        private readonly JagDbContext _context;

        public CartRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cart>> GetCartsAsync()
        {
            return await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(ci => ci.MenuItem)
                        .ThenInclude(mi => mi.Dishes)
                            .ThenInclude(md => md.Dish)
                                .ThenInclude(d => d.Photos)
                .Include(c => c.Items)
                    .ThenInclude(ci => ci.MenuItem)
                    .ThenInclude(m => m.Dishes)
                        .ThenInclude(md => md.Dish)
                            .ThenInclude(d => d.Category)
                .ToListAsync();
        }

        public async Task<Cart> GetCartAsync(int id, bool includeRelated = true)
        {
            if (includeRelated)
            {
                return await _context.Carts
                    .Include(c => c.Items)
                        .ThenInclude(ci => ci.MenuItem)
                            .ThenInclude(mi => mi.Dishes)
                                .ThenInclude(md => md.Dish)
                                    .ThenInclude(d => d.Photos)
                    .Include(c => c.Items)
                        .ThenInclude(ci => ci.MenuItem)
                        .ThenInclude(m => m.Dishes)
                            .ThenInclude(md => md.Dish)
                                .ThenInclude(d => d.Category)
                    .SingleOrDefaultAsync(c => c.Id == id);
            }
            else
            {
                return await _context.Carts
                    .Include(c => c.Items)
                    .SingleOrDefaultAsync(c => c.Id == id);
            }
            
        }

        public async Task<Cart> GetUserCartAsync(int userId)
        {
            return await _context.Carts
                .Include(c => c.Items)
                    .ThenInclude(ci => ci.MenuItem)
                        .ThenInclude(mi => mi.Dishes)
                            .ThenInclude(md => md.Dish)
                                .ThenInclude(d => d.Photos)
                .Include(c => c.Items)
                    .ThenInclude(ci => ci.MenuItem)
                    .ThenInclude(m => m.Dishes)
                        .ThenInclude(md => md.Dish)
                            .ThenInclude(d => d.Category)
                .SingleOrDefaultAsync(c => c.UserId == userId);
        }

        public void Add(Cart cart)
        {
            _context.Carts.Add(cart);
        }

        public void AddCartItemsToAnotherCart(Cart cart, Cart anotherCart)
        {
            var items = anotherCart.Items.Concat(cart.Items);

            foreach (var group in items.GroupBy(ci => ci.MenuItemId).Where(g => g.Count() > 1))
            {
                group.Where(ci => ci.CartId == anotherCart.Id)
                    .Select(ci => ci)
                    .SingleOrDefault().Amount = group.Sum(ci => ci.Amount);

                group.Where(ci => ci.CartId == anotherCart.Id)
                    .Select(ci => ci)
                    .Where(ci => ci.Amount > ci.MenuItem.Available)
                    .ToList()
                    .ForEach(ci =>
                    {
                        ci.Amount = ci.MenuItem.Available;
                    });
            }

            foreach (var group in items.GroupBy(ci => ci.MenuItemId).Where(g => g.Count() == 1))
            {
                group.Where(ci => ci.CartId != anotherCart.Id)
                    .ToList()
                    .ForEach(ci => { ci.CartId = anotherCart.Id; });
            }

            items = items.Where(ci => ci.CartId == anotherCart.Id);
        }

        public async Task UpdateCartItemAmountOfMenuItemAsync(MenuItem item)
        {
            var carts = await GetCartsAsync();

            foreach (var cart in carts)
            {
                var cartItems = cart.Items
                    .Where(ci => ci.MenuItemId == item.Id && ci.Amount > item.Available)
                    .ToList();

                cartItems.ForEach(ci =>
                {
                    if (item.Available > 0)
                        ci.Amount = item.Available;
                    else if (item.Available == 0 && cart.Items.Count == 1)
                        Remove(cart);
                    else
                        RemoveCartItem(ci);
                });
            }
        }

        public void Remove(Cart cart)
        {
            _context.Carts.Remove(cart);
        }

        private void RemoveCartItem(CartItem item)
        {
            _context.CartItems.Remove(item);
        }
    }
}
