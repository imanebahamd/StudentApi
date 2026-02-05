using MediatR;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Students.Commands
{
    
    public record CreateStudentCommand(
        string FirstName,
        string LastName,
        DateTime DateOfBirth
    ) : IRequest<Student>;
}