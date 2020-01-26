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
    public class DishRepository : IDishRepository
    {
        private readonly JagDbContext _context;

        public DishRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<Dish> GetDish(int id)
        {
            return await _context.Dishes
                .Include(d => d.Category)
                .SingleOrDefaultAsync(d => d.Id == id);
        }

        public async Task<IEnumerable<Dish>> GetDishes()
        {
            return await _context.Dishes
                .Include(d => d.Category)
                .ToListAsync();
        }

        public void Add(Dish dish)
        {
            _context.Dishes.Add(dish);
        }

        public void Remove(Dish dish)
        {
            _context.Remove(dish);
        }

        
    }
}
