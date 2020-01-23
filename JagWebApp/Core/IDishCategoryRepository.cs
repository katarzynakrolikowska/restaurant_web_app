using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IDishCategoryRepository
    {
        Task<IEnumerable<Category>> GetCategories();

        Task<bool> CategoryExists(int categoryId);
    }
}