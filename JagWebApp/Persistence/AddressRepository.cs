using JagWebApp.Core;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class AddressRepository : IAddressRepository
    {
        private readonly JagDbContext _context;

        public AddressRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task RemoveAsync(int? addressId)
        {
            if (addressId == null)
                return;

            var address = await GetAddressAsync((int)addressId);
            _context.Addresses.Remove(address);
        }

        private async Task<Address> GetAddressAsync(int id)
        {
            return await _context.Addresses
                .SingleOrDefaultAsync(a => a.Id == id);
        }
    }
}
