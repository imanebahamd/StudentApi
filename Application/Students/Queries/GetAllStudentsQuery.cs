using MediatR;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Students.Queries
{
    public record GetAllStudentsQuery() : IRequest<List<Student>>;
}