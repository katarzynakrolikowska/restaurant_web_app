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
    public class MenuRepository : IMenuRepository
    {
        private readonly JagDbContext _context;

        public MenuRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MenuItem>> GetMenuItems()
        {
            return await _context.MenuItems
                .Include(m => m.Dish)
                    .ThenInclude(d => d.Category)
                .Include(d => d.Dish)
                    .ThenInclude(d => d.Photos)
                .ToListAsync();
        }

        public async Task<MenuItem> GetMenuItem(int id)
        {
            return await _context.MenuItems
                .Include(m => m.Dish)
                    .ThenInclude(d => d.Category)
                .Include(d => d.Dish)
                    .ThenInclude(d => d.Photos)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public void Add(MenuItem menuItem)
        {
            _context.MenuItems.Add(menuItem);
        }

        public void Remove(MenuItem menuItem)
        {
            _context.MenuItems.Remove(menuItem);
        }
    }
}
