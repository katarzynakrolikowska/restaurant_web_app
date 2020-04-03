using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetOrders();

        Task<IEnumerable<Order>> GetUserOrders(int userId);

        Task<Order> GetOrder(int id);

        Task<Order> GetUserOrder(int id, int userId);

        void Add(Order order);
    }
}