using MediatR;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Students.Queries
{
    
    public record GetStudentByIdQuery(int Id) : IRequest<Student?>;
}
