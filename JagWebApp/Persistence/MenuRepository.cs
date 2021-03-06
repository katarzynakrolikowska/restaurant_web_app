﻿using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Collections.ObjectModel;
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

        public async Task<IEnumerable<MenuItem>> GetMenuItemsAsync()
        {
            return await _context.MenuItems
                .Include(m => m.Dishes)
                    .ThenInclude(md => md.Dish)
                        .ThenInclude(d => d.Photos)
                .Include(m => m.Dishes)
                    .ThenInclude(md => md.Dish)
                        .ThenInclude(d => d.Category)
                .Include(m => m.Orders)
                    .ThenInclude(omi => omi.Order)
                .ToListAsync();
        }

        public async Task<MenuItem> GetMenuItemAsync(int id)
        {
            return await _context.MenuItems
                .Include(m => m.Dishes)
                    .ThenInclude(md => md.Dish)
                        .ThenInclude(d => d.Photos)
                .Include(m => m.Dishes)
                    .ThenInclude(md => md.Dish)
                        .ThenInclude(d => d.Category)
                .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<MenuItem> GetMainMenuItemAsync()
        {
            return await _context.MenuItems
                .Include(m => m.Dishes)
                    .ThenInclude(md => md.Dish)
                        .ThenInclude(d => d.Photos)
                .Include(m => m.Dishes)
                    .ThenInclude(md => md.Dish)
                        .ThenInclude(d => d.Category)
                .SingleOrDefaultAsync(m => m.IsMain == true);
        }

        public async Task<MenuItem> GetMenuItemWithDishAsync(int dishId)
        {
            return await _context.MenuItems
                .Where(m => m.Dishes.Any(mid => mid.DishId == dishId))
                .FirstOrDefaultAsync();
        }

        public void Add(MenuItem menuItem)
        {
            _context.MenuItems.Add(menuItem);
        }

        public void Remove(MenuItem menuItem)
        {
            _context.MenuItems.Remove(menuItem);
        }

        public async Task<IEnumerable<MenuItem>> UpdateAvailabilityAsync(IEnumerable<CartItem> cartItems)
        {
            var updatedMenuItems = new Collection<MenuItem>();

            foreach (var cartItem in cartItems)
            {
                var menuItem = await GetMenuItemAsync(cartItem.MenuItemId);
                if (menuItem.Available - cartItem.Amount >= 0)
                {
                    menuItem.Available -= cartItem.Amount;
                    updatedMenuItems.Add(menuItem);
                }
            }

            return updatedMenuItems;
        }
    }
}
