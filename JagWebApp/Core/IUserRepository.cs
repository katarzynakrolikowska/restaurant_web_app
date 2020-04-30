using System.Threading.Tasks;
using JagWebApp.Core.Models.Identity;

namespace JagWebApp.Core
{
    public interface IUserRepository
    {
        Task<User> GetUserAsync(int id);
    }
}