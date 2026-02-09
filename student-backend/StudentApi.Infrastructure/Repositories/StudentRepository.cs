using Microsoft.EntityFrameworkCore;
using StudentApi.Domain.Entities;
using StudentApi.Domain.Interfaces;
using StudentApi.Infrastructure.Persistence;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace StudentApi.Infrastructure.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly AppDbContext _context;

        public StudentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Students
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        }

        public async Task<List<Student>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _context.Students.ToListAsync(cancellationToken);
        }

        public async Task<Student> AddAsync(Student student, CancellationToken cancellationToken = default)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync(cancellationToken);
            return student;
        }

        public async Task UpdateAsync(Student updatedStudent, CancellationToken cancellationToken = default)
{
    var existingStudent = await _context.Students
        .FirstOrDefaultAsync(s => s.Id == updatedStudent.Id, cancellationToken);
        
    if (existingStudent == null)
        return;

    existingStudent.SetFirstName(updatedStudent.FirstName);
    existingStudent.SetLastName(updatedStudent.LastName);
    existingStudent.SetDateOfBirth(updatedStudent.DateOfBirth);

    await _context.SaveChangesAsync(cancellationToken);
}

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var student = await GetByIdAsync(id, cancellationToken);
            if (student == null) return false;

            _context.Students.Remove(student);
            await _context.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _context.Students.AnyAsync(s => s.Id == id, cancellationToken);
        }
    }
}