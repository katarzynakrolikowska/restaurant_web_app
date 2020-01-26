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
    public class DishCategoryRepository : IDishCategoryRepository
    {
        private readonly JagDbContext _context;

        public DishCategoryRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Category>> GetCategories()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<bool> CategoryExists(int categoryId)
        {
            var category = await _context.Categories.SingleOrDefaultAsync(c => c.Id == categoryId);

            return category != null ? true : false;
        }
    }
}
