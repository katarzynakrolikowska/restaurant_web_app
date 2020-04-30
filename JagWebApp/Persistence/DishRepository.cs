using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
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

        public async Task<Dish> GetDishAsync(int id)
        {
            return await _context.Dishes
                .Include(d => d.Category)
                .Include(d => d.Photos)
                .SingleOrDefaultAsync(d => d.Id == id);
        }

        public async Task<IEnumerable<Dish>> GetDishesAsync()
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

        public async Task<bool> DishesExistAsync(IEnumerable<int> ids)
        {
            var dishesExist = true;

            foreach (var id in ids)
            {
                var dish = await GetDishAsync(id);
                if (dish == null)
                {
                    dishesExist = false;
                    break;
                }
            }

            return dishesExist;
        }
    }
}
