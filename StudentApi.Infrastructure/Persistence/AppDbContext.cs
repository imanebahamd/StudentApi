using Microsoft.EntityFrameworkCore;
using StudentApi.Domain.Entities;
using StudentApi.Infrastructure.Persistence.Configurations;

namespace StudentApi.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Student> Students => Set<Student>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfiguration(new StudentConfiguration());
        }
    }
}
