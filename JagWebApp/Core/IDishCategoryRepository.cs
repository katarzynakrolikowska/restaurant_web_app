using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IDishCategoryRepository
    {
        Task<Category> GetCategoryAsync(int id);

        Task<IEnumerable<Category>> GetCategories();

        Task<bool> CategoryExistsAsync(int categoryId);

        void Add(Category category);

        void Remove(Category category);

        Task<bool> DishWithCategoryExistsAsync(int categoryId);
    }
}