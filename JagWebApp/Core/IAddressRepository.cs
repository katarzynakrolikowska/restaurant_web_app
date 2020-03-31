using System.Threading.Tasks;

namespace JagWebApp.Core
{
    public interface IAddressRepository
    {
        Task Remove(int? addressId);
    }
}