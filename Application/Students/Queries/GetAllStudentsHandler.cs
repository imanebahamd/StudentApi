using MediatR;
using Microsoft.EntityFrameworkCore;
using StudentApi.Infrastructure.Persistence;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Students.Queries
{
    public class GetAllStudentsHandler 
        : IRequestHandler<GetAllStudentsQuery, List<Student>>
    {
        private readonly AppDbContext _context;

        public GetAllStudentsHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Student>> Handle(
            GetAllStudentsQuery request,
            CancellationToken cancellationToken
        )
        {
            return await _context.Students.ToListAsync(cancellationToken);
        }
    }
}
