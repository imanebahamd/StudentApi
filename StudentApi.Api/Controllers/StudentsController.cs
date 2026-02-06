using MediatR;
using Microsoft.AspNetCore.Mvc;
using StudentApi.Application.DTOs;
using StudentApi.Application.Students.Commands;
using StudentApi.Application.Students.Queries;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<ActionResult<List<StudentDto>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllStudentsQuery());
            return Ok(result);
        }

        // GET: api/students/1
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentDto>> GetById(int id)
        {
            var student = await _mediator.Send(new GetStudentByIdQuery(id));
            
            if (student == null)
                return NotFound();
                
            return Ok(student);
        }

        // POST: api/students
        [HttpPost]
        public async Task<ActionResult<int>> Create([FromBody] CreateStudentCommand command)
        {
            var id = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        // PUT: api/students/1
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(int id, [FromBody] UpdateStudentCommand command)
        {
            if (id != command.Id)
                return BadRequest();
                
            var result = await _mediator.Send(command);
            
            if (result == null)
                return NotFound();
                
            return NoContent();
        }

        // DELETE: api/students/1
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var success = await _mediator.Send(new DeleteStudentCommand(id));
            
            if (!success)
                return NotFound();
                
            return NoContent();
        }
    }
}