using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentApi.Domain.Entities;

namespace StudentApi.Infrastructure.Persistence.Configurations
{
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.ToTable("Students");
            
            builder.HasKey(s => s.Id);
            
            builder.Property(s => s.Id)
                .ValueGeneratedOnAdd();
            

            builder.Property("_firstName")
                .HasColumnName("FirstName")
                .HasMaxLength(50)
                .IsRequired();
                
            builder.Property("_lastName")
                .HasColumnName("LastName")
                .HasMaxLength(50)
                .IsRequired();
                
            builder.Property("_dateOfBirth")
                .HasColumnName("DateOfBirth")
                .IsRequired();
        }
    }
}