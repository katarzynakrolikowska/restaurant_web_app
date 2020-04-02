using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface IOrderRepository
    {
        void Add(Order order);
    }
}