using System;

namespace StudentApi.Domain.Entities
{
    public class Student
    {
        // Private fields for encapsulation
        private string _firstName = string.Empty;
        private string _lastName = string.Empty;
        private DateTime _dateOfBirth;

        // Private constructor for EF Core
        private Student() { }

        // Public constructor for domain logic
        public Student(string firstName, string lastName, DateTime dateOfBirth)
        {
            SetFirstName(firstName);
            SetLastName(lastName);
            SetDateOfBirth(dateOfBirth);
        }

        // Properties with private setters
        public int Id { get; private set; }
        
        public string FirstName => _firstName;
        public string LastName => _lastName;
        public DateTime DateOfBirth => _dateOfBirth;

        // Domain methods with validation
        public void SetFirstName(string firstName)
        {
            if (string.IsNullOrWhiteSpace(firstName))
                throw new ArgumentException("First name cannot be empty", nameof(firstName));
            
            if (firstName.Length > 50)
                throw new ArgumentException("First name cannot exceed 50 characters", nameof(firstName));
            
            _firstName = firstName.Trim();
        }

        public void SetLastName(string lastName)
        {
            if (string.IsNullOrWhiteSpace(lastName))
                throw new ArgumentException("Last name cannot be empty", nameof(lastName));
            
            if (lastName.Length > 50)
                throw new ArgumentException("Last name cannot exceed 50 characters", nameof(lastName));
            
            _lastName = lastName.Trim();
        }

        public void SetDateOfBirth(DateTime dateOfBirth)
        {
            if (dateOfBirth > DateTime.Now.AddYears(-10))
                throw new ArgumentException("Student must be at least 10 years old", nameof(dateOfBirth));
            
            if (dateOfBirth < DateTime.Now.AddYears(-100))
                throw new ArgumentException("Date of birth is not valid", nameof(dateOfBirth));
            
            _dateOfBirth = dateOfBirth.Date;
        }

        // Domain logic methods
        public int GetAge()
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;
            
            if (DateOfBirth.Date > today.AddYears(-age)) 
                age--;
            
            return age;
        }

        public string GetFullName() => $"{FirstName} {LastName}";
    }
}