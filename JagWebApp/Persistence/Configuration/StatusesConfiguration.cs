using JagWebApp.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace JagWebApp.Persistence.Configuration
{
    public class StatusesConfiguration : IEntityTypeConfiguration<Status>
    {
        public void Configure(EntityTypeBuilder<Status> builder)
        {
            builder.ToTable("Statuses");
            builder.Property(c => c.Name)
                .IsRequired(true);

            builder.HasData
            (
                new Status
                {
                    Id = 1,
                    Name = "W trakcie realizacji"
                },
                new Category
                {
                    Id = 2,
                    Name = "Zrealizowane"
                }
            );
        }
    }
}
