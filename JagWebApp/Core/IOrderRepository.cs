using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetOrdersAsync();

        Task<IEnumerable<Order>> GetUserOrdersAsync(int userId);

        Task<Order> GetOrder(int id);

        Task<Order> GetUserOrderAsync(int id, int userId);

        void Add(Order order);
    }
}