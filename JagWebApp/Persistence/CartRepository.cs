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
    public class CartRepository : ICartRepository
    {
        private readonly JagDbContext _context;

        public CartRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cart>> GetCarts()
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

        public async Task<Cart> GetCart(int id)
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

        public void Add(Cart cart)
        {
            _context.Carts.Add(cart);
        }

        public void Remove(Cart cart)
        {
            _context.Carts.Remove(cart);
        }
    }
}
