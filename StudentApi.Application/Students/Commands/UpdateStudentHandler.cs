using AutoMapper;
using MediatR;
using StudentApi.Application.DTOs;
using StudentApi.Domain.Entities;
using StudentApi.Domain.Interfaces;

namespace StudentApi.Application.Students.Commands
{
    public class UpdateStudentHandler : IRequestHandler<UpdateStudentCommand, StudentDto?>
    {
        private readonly IStudentRepository _studentRepository;
        private readonly IMapper _mapper;

        public UpdateStudentHandler(
            IStudentRepository studentRepository,
            IMapper mapper)
        {
            _studentRepository = studentRepository;
            _mapper = mapper;
        }

        public async Task<StudentDto?> Handle(
            UpdateStudentCommand request,
            CancellationToken cancellationToken)
        {
            var student = await _studentRepository.GetByIdAsync(request.Id, cancellationToken);
            
            if (student == null)
                return null;

            student.SetFirstName(request.FirstName);
            student.SetLastName(request.LastName);
            student.SetDateOfBirth(request.DateOfBirth);

            await _studentRepository.UpdateAsync(student, cancellationToken);
            
            return _mapper.Map<StudentDto>(student);
        }
    }
}