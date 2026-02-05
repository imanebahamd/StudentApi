using MediatR;
using Microsoft.AspNetCore.Mvc;
using StudentApi.Application.Students.Commands;
using StudentApi.Application.Students.Queries;
using StudentApi.Domain.Entities;

namespace StudentApi.Api.Controllers
{
    [ApiController]
    [Route("api/students")]
    public class StudentsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public StudentsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        // GET: api/students
        [HttpGet]
        public async Task<List<Student>> GetAll()
        {
            return await _mediator.Send(new GetAllStudentsQuery());
        }

        // GET: api/students/1
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetById(int id)
        {
            var student = await _mediator.Send(new GetStudentByIdQuery(id));

            if (student == null)
                return NotFound();

            return student;
        }

        // POST: api/students
        [HttpPost]
        public async Task<Student> Create(CreateStudentCommand command)
        {
            return await _mediator.Send(command);
        }

        // PUT: api/students/1
        [HttpPut("{id}")]
        public async Task<ActionResult<Student>> Update(int id, UpdateStudentCommand command)
        {
            if (id != command.Id)
                return BadRequest();

            var student = await _mediator.Send(command);

            if (student == null)
                return NotFound();

            return student;
        }

        // DELETE: api/students/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteStudentCommand(id));

            if (!success)
                return NotFound();

            return NoContent();
        }
    }
}
