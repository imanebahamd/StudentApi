using MediatR;
using StudentApi.Domain.Entities;
using StudentApi.Domain.Interfaces;

namespace StudentApi.Application.Students.Commands
{
    public class CreateStudentHandler : IRequestHandler<CreateStudentCommand, int>
    {
        private readonly IStudentRepository _studentRepository;

        public CreateStudentHandler(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public async Task<int> Handle(
            CreateStudentCommand request,
            CancellationToken cancellationToken)
        {
            var student = new Student(
                request.FirstName,
                request.LastName,
                request.DateOfBirth
            );

            await _studentRepository.AddAsync(student, cancellationToken);
            return student.Id;
        }
    }
}