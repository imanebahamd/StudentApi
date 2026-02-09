using MediatR;
using StudentApi.Application.DTOs;

namespace StudentApi.Application.Students.Queries
{
    public record GetStudentByIdQuery(int Id) : IRequest<StudentDto?>;
}