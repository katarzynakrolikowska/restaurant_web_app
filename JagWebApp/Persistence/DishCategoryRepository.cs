using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class DishCategoryRepository : IDishCategoryRepository
    {
        private readonly JagDbContext _context;

        public DishCategoryRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<Category> GetCategory(int id)
        {
            return await _context.Categories.SingleOrDefaultAsync(c => c.Id == id);
        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<bool> CategoryExists(int categoryId)
        {
            var category = await GetCategory(categoryId);

            return category != null;
        }

        public void Add(Category category)
        {
            _context.Categories.Add(category);
        }

        public void Remove(Category category)
        {
            _context.Categories.Remove(category);
        }

        public async Task<bool> DishWithCategoryExists(int categoryId)
        {
            var dishes = await _context.Dishes.Where(d => d.CategoryId == categoryId).ToListAsync();

            return dishes.Count > 0;
        }
    }
}
