using MediatR;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Students.Commands
{
    public record UpdateStudentCommand(
        int Id,
        string FirstName,
        string LastName,
        DateTime DateOfBirth
    ) : IRequest<Student?>;
}