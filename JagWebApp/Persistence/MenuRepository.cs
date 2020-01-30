using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
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

        public void Add(MenuItem menuItem)
        {
            _context.MenuItems.Add(menuItem);
        }
    }
}
