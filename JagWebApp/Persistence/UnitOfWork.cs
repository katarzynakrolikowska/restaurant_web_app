using JagWebApp.Core;
using JagWebApp.Persistance;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly JagDbContext _context;

        public UnitOfWork(JagDbContext context)
        {
            _context = context;
        }

        public async Task CompleteAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
