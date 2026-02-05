using MediatR;
using StudentApi.Domain.Entities;
using StudentApi.Infrastructure.Persistence;

namespace StudentApi.Application.Students.Commands
{
    public class CreateStudentHandler 
        : IRequestHandler<CreateStudentCommand, Student>
    {
        private readonly AppDbContext _context;

        public CreateStudentHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Student> Handle(
            CreateStudentCommand request,
            CancellationToken cancellationToken
        )
        {
            var student = new Student
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                DateOfBirth = request.DateOfBirth
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync(cancellationToken);

            return student;
        }
    }
}
