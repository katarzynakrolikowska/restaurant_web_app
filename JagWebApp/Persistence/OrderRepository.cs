﻿using JagWebApp.Core;
using JagWebApp.Core.Models;
using JagWebApp.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence
{
    public class OrderRepository : IOrderRepository
    {
        private readonly JagDbContext _context;

        public OrderRepository(JagDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.Items)
                .Include(o => o.User)
                    .ThenInclude(u => u.Address)
                .Include(o => o.Status)
                .ToListAsync();
        }

        public async Task<IEnumerable<Order>> GetUserOrdersAsync(int userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .Include(o => o.Status)
                .ToListAsync();
        }

        public async Task<Order> GetOrder(int id)
        {
            return await _context.Orders
                .Where(o => o.Id == id)
                .Include(o => o.Items)
                .Include(o => o.User)
                    .ThenInclude(u => u.Address)
                .Include(o => o.MenuItems)
                .Include(o => o.Status)
                .SingleOrDefaultAsync();
        }

        public async Task<Order> GetUserOrderAsync(int id, int userId)
        {
            return await _context.Orders
                .Where(o => o.Id == id && o.UserId == userId)
                .Include(o => o.Items)
                .Include(o => o.Status)
                .SingleOrDefaultAsync();
        }

        public void Add(Order order)
        {
            _context.Orders.Add(order);
        }
    }
}
