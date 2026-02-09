using MediatR;
using StudentApi.Domain.Interfaces;

namespace StudentApi.Application.Students.Commands
{
    public class DeleteStudentHandler : IRequestHandler<DeleteStudentCommand, bool>
    {
        private readonly IStudentRepository _studentRepository;

        public DeleteStudentHandler(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public async Task<bool> Handle(
            DeleteStudentCommand request,
            CancellationToken cancellationToken)
        {
            return await _studentRepository.DeleteAsync(request.Id, cancellationToken);
        }
    }
}