using AutoMapper;
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
            CreateMap<SaveMenuItemResource, MenuItem>()
                .ForMember(mi => mi.Available, opt => opt.MapFrom(mir => mir.Limit))
                .ForMember(mi => mi.Dishes, opt => opt.Ignore())
                .AfterMap((mir, mi) =>
                {
                    var removedDishes = mi.Dishes.Where(mid => !mi.Dishes.Contains(mid));

                    foreach (var mid in removedDishes.ToList())
                        mi.Dishes.Remove(mid);


                    var addedDishes = mir.Dishes.Where(id => !mi.Dishes.Any(mid => mid.DishId == id));

                    foreach (var id in addedDishes)
                        mi.Dishes.Add(new MenuItemDish { DishId = id });
                });


            CreateMap<Dish, DishResource>()
                .ForMember(dr => dr.MainPhoto, opt => opt.MapFrom(d => d.Photos.SingleOrDefault(p => p.IsMain == true)));
            CreateMap<Dish, SaveDishResource>();
            CreateMap<Category, CategoryResource>();
            CreateMap<Photo, PhotoResource>();
            CreateMap<MenuItem, MenuItemResource>()
                .ForMember(mir => mir.Dishes, opt => opt.MapFrom(item =>
                    item.Dishes.Select(itemDish => new DishResource
                    {
                        Id = itemDish.DishId,
                        Name = itemDish.Dish.Name,
                        Amount = itemDish.Dish.Amount,
                        Category = new CategoryResource
                        {
                            Id = itemDish.Dish.Category.Id,
                            Name = itemDish.Dish.Category.Name
                        },
                        MainPhoto = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true) != null ? new PhotoResource
                        {
                            Id = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true).Id,
                            Name = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true).Name,
                            ThumbnailName = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true).ThumbnailName,
                            IsMain = true
                        } : null
                    }
                )));
        }
    }
}
