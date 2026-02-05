using MediatR;
using Microsoft.EntityFrameworkCore;
using StudentApi.Infrastructure.Persistence;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Students.Queries
{
    public class GetStudentByIdHandler 
        : IRequestHandler<GetStudentByIdQuery, Student?>
    {
        private readonly AppDbContext _context;

        public GetStudentByIdHandler(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Student?> Handle(
            GetStudentByIdQuery request,
            CancellationToken cancellationToken
        )
        {
            return await _context.Students
                .FirstOrDefaultAsync(s => s.Id == request.Id, cancellationToken);
        }
    }
}
