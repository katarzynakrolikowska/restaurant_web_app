using JagWebApp.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Persistence.Configuration
{
    public class CategoriesConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Categories");
            builder.Property(c => c.Name)
                .IsRequired(true);

            builder.HasData
            (
                new Category
                {
                    Id = 1,
                    Name = "Zupa"
                },
                new Category
                {
                    Id = 2,
                    Name = "Drugie danie"
                },
                new Category
                {
                    Id = 3,
                    Name = "Deser"
                }
            );
        }
    }
}
