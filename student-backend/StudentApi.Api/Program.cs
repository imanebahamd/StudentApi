using FluentValidation;
using Microsoft.EntityFrameworkCore;
using StudentApi.Api.Middleware;
using StudentApi.Application.Common.Behaviors;
using StudentApi.Domain.Interfaces;
using StudentApi.Infrastructure.Persistence;
using StudentApi.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repository
builder.Services.AddScoped<IStudentRepository, StudentRepository>();

// MediatR with Validation Behavior
builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(StudentApi.Application.Students.Commands.CreateStudentCommand).Assembly);
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});

// AutoMapper
builder.Services.AddAutoMapper(typeof(StudentApi.Application.Mappings.MappingProfile));

// FluentValidation
builder.Services.AddValidatorsFromAssembly(typeof(StudentApi.Application.Students.Commands.CreateStudentCommand).Assembly);

// CORS - ADD THIS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "https://localhost:4200") // Allow both HTTP and HTTPS
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

// CORS - ADD THIS (BEFORE UseAuthorization)
app.UseCors("AllowAngularApp");

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();