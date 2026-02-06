using AutoMapper;
using MediatR;
using StudentApi.Application.DTOs;
using StudentApi.Domain.Interfaces;

namespace StudentApi.Application.Students.Queries
{
    public class GetAllStudentsHandler 
        : IRequestHandler<GetAllStudentsQuery, List<StudentDto>>
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IMapper _mapper;

        public GetAllStudentsHandler(
            IStudentRepository studentRepository,
            IMapper mapper)
        {
            _studentRepository = studentRepository;
            _mapper = mapper;
        }

        public async Task<List<StudentDto>> Handle(
            GetAllStudentsQuery request,
            CancellationToken cancellationToken)
        {
            var students = await _studentRepository.GetAllAsync(cancellationToken);
            return _mapper.Map<List<StudentDto>>(students);
        }
    }
}