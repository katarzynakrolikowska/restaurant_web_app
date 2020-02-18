using System.Collections.Generic;
using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface ICartRepository
    {
        Task<IEnumerable<Cart>> GetCarts();

        Task<Cart> GetCart(int id);

        void Add(Cart cart);

        void Remove(Cart cart);
    }
}