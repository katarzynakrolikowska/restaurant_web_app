using JagWebApp.Core;
using JagWebApp.Core.Models;
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

        public async Task Remove(int? addressId)
        {
            if (addressId == null)
                return;

            var address = await GetAddress((int)addressId);
            _context.Addresses.Remove(address);
        }

        private async Task<Address> GetAddress(int id)
        {
            return await _context.Addresses
                .SingleOrDefaultAsync(a => a.Id == id);
        }
    }
}
