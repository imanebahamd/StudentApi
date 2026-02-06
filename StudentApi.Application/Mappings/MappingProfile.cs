using AutoMapper;
using StudentApi.Application.DTOs;
using StudentApi.Domain.Entities;

namespace StudentApi.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Student, StudentDto>()
                .ForMember(dest => dest.FullName, 
                    opt => opt.MapFrom(src => src.GetFullName()))
                .ForMember(dest => dest.Age,
                    opt => opt.MapFrom(src => src.GetAge()));
        }
    }
}