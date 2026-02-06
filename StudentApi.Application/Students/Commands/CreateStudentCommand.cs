using FluentValidation;
using MediatR;

namespace StudentApi.Application.Students.Commands
{
    public record CreateStudentCommand(
        string FirstName,
        string LastName,
        DateTime DateOfBirth
    ) : IRequest<int>;

    public class CreateStudentCommandValidator : AbstractValidator<CreateStudentCommand>
    {
        public CreateStudentCommandValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("First name is required")
                .MaximumLength(50).WithMessage("First name cannot exceed 50 characters");
                
            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Last name is required")
                .MaximumLength(50).WithMessage("Last name cannot exceed 50 characters");
                
            RuleFor(x => x.DateOfBirth)
                .LessThan(DateTime.Now.AddYears(-10))
                .WithMessage("Student must be at least 10 years old");
        }
    }
}