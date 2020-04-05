using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IDishCategoryRepository
    {
        Task<Category> GetCategory(int id);

        Task<IEnumerable<Category>> GetCategories();

        Task<bool> CategoryExists(int categoryId);

        void Add(Category category);

        void Remove(Category category);

        Task<bool> DishWithCategoryExists(int categoryId);
    }
}