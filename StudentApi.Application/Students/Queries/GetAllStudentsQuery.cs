using MediatR;
using StudentApi.Application.DTOs;
using System.Collections.Generic;

namespace StudentApi.Application.Students.Queries
{
    public record GetAllStudentsQuery() : IRequest<List<StudentDto>>;
}