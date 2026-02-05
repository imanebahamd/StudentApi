using MediatR;

namespace StudentApi.Application.Students.Commands
{
    public record DeleteStudentCommand(int Id) : IRequest<bool>;
}