﻿using AutoMapper;
using JagWebApp.Core.Models;
using JagWebApp.Resources;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserForRegisterResource, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(ur => ur.Email));

            CreateMap<DishResource, Dish>();
            CreateMap<SaveDishResource, Dish>();
            CreateMap<CategoryResource, Category>();


            CreateMap<Dish, DishResource>();
            CreateMap<Dish, SaveDishResource>();
            CreateMap<Category, CategoryResource>();

        }
    }
}
