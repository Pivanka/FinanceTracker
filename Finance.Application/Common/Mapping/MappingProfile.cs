using AutoMapper;
using Finance.Application.Common.Models;
using Finance.Domain.Entities;

namespace Finance.Application.Common.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Transaction, TransactionModel>()
            .ForMember(dest => dest.Category, opts => opts.Condition(x => x.Category is not null))
            .ReverseMap();
        CreateMap<Category, CategoryModel>().ReverseMap();
        CreateMap<CustomCategory, CategoryModel>().ReverseMap();
        CreateMap<Notification, NotificationModel>().ReverseMap();
    }
}