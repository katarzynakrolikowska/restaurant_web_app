using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface IUserRepository
    {
        Task<User> GetUser(int id);
    }
}