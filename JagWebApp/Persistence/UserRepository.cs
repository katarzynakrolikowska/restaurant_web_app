﻿using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class UserRepository : IUserRepository
    {
        private readonly JagDbContext _context;

        public UserRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUser(int id)
        {
            return await _context.Users
                .Include(u => u.Address)
                .SingleOrDefaultAsync(u => u.Id == id);
        }
    }
}
