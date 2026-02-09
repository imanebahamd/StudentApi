using AutoMapper;
using MediatR;
using StudentApi.Application.DTOs;
using StudentApi.Domain.Interfaces;

namespace StudentApi.Application.Students.Queries
{
    public class GetStudentByIdHandler : IRequestHandler<GetStudentByIdQuery, StudentDto?>
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IMapper _mapper;

        public GetStudentByIdHandler(
            IStudentRepository studentRepository,
            IMapper mapper)
        {
            _studentRepository = studentRepository;
            _mapper = mapper;
        }

        public async Task<StudentDto?> Handle(
            GetStudentByIdQuery request,
            CancellationToken cancellationToken)
        {
            var student = await _studentRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (student == null)
                return null;
                
            return _mapper.Map<StudentDto>(student);
        }
    }
}