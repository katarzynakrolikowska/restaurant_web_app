using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IUnitOfWork
    {
        Task CompleteAsync();
    }
}