using MediatR;
using Microsoft.EntityFrameworkCore;
using StudentApi.Infrastructure.Persistence;
using StudentApi.Domain.Entities;


namespace StudentApi.Application.Students.Commands
{
    public class UpdateStudentHandler 
        : IRequestHandler<UpdateStudentCommand, Student?>
    {
        private readonly AppDbContext _context;

        public UpdateStudentHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> Handle(
            UpdateStudentCommand request,
            CancellationToken cancellationToken
        )
        {
            var student = await _context.Students
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);

            if (student == null)
                return null;

            student.FirstName = request.FirstName;
            student.LastName = request.LastName;
            student.DateOfBirth = request.DateOfBirth;

            await _context.SaveChangesAsync(cancellationToken);

            return student;
        }
    }
}