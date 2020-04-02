using JagWebApp.Core.Models;
using JagWebApp.Persistence.Configuration;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace JagWebApp.Persistance
{
    public class JagDbContext : IdentityDbContext<User, Role, int, IdentityUserClaim<int>, UserRole,
        IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
    {
        public JagDbContext(DbContextOptions<JagDbContext> options)
            : base(options)
        {
        }

        public DbSet<Dish> Dishes { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Photo> Photos { get; set; }

        public DbSet<MenuItem> MenuItems { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<CartItem> CartItems { get; set; }

        public DbSet<Address> Addresses { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderedItem> OrderedItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>(userRole =>
            {
                userRole.HasKey(ur => new { ur.UserId, ur.RoleId });

                userRole.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(ur => ur.RoleId)
                    .IsRequired();

                userRole.HasOne(ur => ur.User)
                   .WithMany(r => r.UserRoles)
                   .HasForeignKey(ur => ur.UserId)
                   .IsRequired();
            });

            modelBuilder.Entity<Dish>()
                .Property(d => d.Amount)
                .HasDefaultValue(1);

            modelBuilder.Entity<Photo>()
               .Property(p => p.IsMain)
               .HasDefaultValue(false);

            modelBuilder.ApplyConfiguration(new CategoriesConfiguration());

            modelBuilder.Entity<MenuItemDish>().HasKey(md =>
                new { md.MenuItemId, md.DishId });

            modelBuilder.Entity<MenuItem>()
                .Property(mi => mi.IsMain)
                .HasDefaultValue(false);
        }
    }
}
