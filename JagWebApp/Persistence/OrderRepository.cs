using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class OrderRepository : IOrderRepository
    {
        private readonly JagDbContext _context;

        public OrderRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetUserOrders(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .ToListAsync();
        }

        public async Task<Order> GetUserOrder(int id, int userId)
        {
            return await _context.Orders
                .Where(o => o.Id == id && o.UserId == userId)
                .Include(o => o.Items)
                .SingleOrDefaultAsync();
        }

        public void Add(Order order)
        {
            _context.Orders.Add(order);
        }
    }
}
