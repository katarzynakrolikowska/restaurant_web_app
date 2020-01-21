using System.Threading.Tasks;
using JagWebApp.Core.Models;

namespace JagWebApp.Core
{
    public interface ITokenRepository
    {
        Task<string> GenerateToken(User user);
    }
}