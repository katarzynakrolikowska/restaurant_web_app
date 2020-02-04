using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IMenuRepository
    {
        Task<IEnumerable<MenuItem>> GetMenuItems();

        Task<MenuItem> GetMenuItem(int id);

        void Add(MenuItem menuItem);

        void Remove(MenuItem menuItem);
    }
}