using FluentValidation;
using MediatR;
using StudentApi.Application.DTOs;

namespace StudentApi.Application.Students.Commands
{
    public record UpdateStudentCommand(
        int Id,
        string FirstName,
        string LastName,
        DateTime DateOfBirth
    ) : IRequest<StudentDto?>;

    public class UpdateStudentCommandValidator : AbstractValidator<UpdateStudentCommand>
    {
        public UpdateStudentCommandValidator()
        {
            RuleFor(x => x.Id)
                .GreaterThan(0).WithMessage("Id must be greater than 0");
                
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