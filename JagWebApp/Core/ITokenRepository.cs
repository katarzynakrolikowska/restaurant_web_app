using System.Threading.Tasks;
using JagWebApp.Core.Models.Identity;

namespace JagWebApp.Core
{
    public interface ITokenRepository
    {
        Task<string> GenerateTokenAsync(User user);
    }
}