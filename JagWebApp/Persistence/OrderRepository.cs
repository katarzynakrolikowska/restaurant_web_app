using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;

namespace JagWebApp.Persistence
{
    public class OrderRepository : IOrderRepository
    {
        private readonly JagDbContext _context;

        public OrderRepository(JagDbContext context)
        {
            _context = context;
        }

        public void Add(Order order)
        {
            _context.Orders.Add(order);
        }
    }
}
