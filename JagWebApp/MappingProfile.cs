using AutoMapper;
using JagWebApp.Core.Models;
using JagWebApp.Core.Models.Identity;
using JagWebApp.Resources.CartResources;
using JagWebApp.Resources.CategoryResources;
using JagWebApp.Resources.DishResources;
using JagWebApp.Resources.MenuItemResources;
using JagWebApp.Resources.OrderResources;
using JagWebApp.Resources.UserResources;
using System;
using System.Collections.ObjectModel;
using System.Linq;

namespace JagWebApp
{
    public class MappingProfile : Profile
    {
        private const int STATUS_ORDER_COMPLETED = 2;
        public MappingProfile()
        {
            CreateMap<UserForRegisterResource, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(ur => ur.Email));

            CreateMap<DishResource, Dish>();
            CreateMap<SaveDishResource, Dish>();
            CreateMap<CategoryResource, Category>();
            CreateMap<SaveMenuItemResource, MenuItem>()
                .ForMember(mi => mi.Dishes, opt => opt.Ignore())
                .AfterMap((mir, mi) =>
                {
                    foreach (var id in mir.Dishes)
                        mi.Dishes.Add(new MenuItemDish { DishId = id });
                });

            CreateMap<UpdateMenuItemResource, MenuItem>()
                .ForMember(mi => mi.Dishes, opt => opt.Ignore())
                .AfterMap((mir, mi) =>
                {

                    if (mi.IsMain)
                    {
                        var removedDishes = mi.Dishes.Where(mid => !mir.Dishes.Contains(mid.DishId));

                        foreach (var mid in removedDishes.ToList())
                            mi.Dishes.Remove(mid);


                        var addedDishes = mir.Dishes.Where(id => !mi.Dishes.Any(mid => mid.DishId == id));

                        foreach (var id in addedDishes)
                            mi.Dishes.Add(new MenuItemDish { DishId = id });
                    }
                });

            CreateMap<SaveCartResource, Cart>()
                .ForMember(c => c.Items, opt => opt.Ignore())
                .AfterMap((scr, c) =>
                {
                    c.Items = new Collection<CartItem>
                    {
                        new CartItem { MenuItemId = scr.MenuItemId, Amount = 1 }
                    };
                });
            CreateMap<UpdateCartResource, Cart>();
            CreateMap<UpdateCartItemResource, CartItem>();
            CreateMap<UpdateUserResource, User>();
            CreateMap<AddressResource, Address>();
            CreateMap<UpdateOrderResource, Order>()
                .ForMember(o => o.MenuItems, opt => opt.Ignore())
                .AfterMap((uor, o) =>
                {
                    if (uor.StatusId == STATUS_ORDER_COMPLETED)
                    {
                        o.MenuItems.Where(omi => omi.OrderId == uor.Id)
                        .ToList()
                        .ForEach(omi => o.MenuItems.Remove(omi));
                    }
                });
            CreateMap<SaveCategoryResource, Category>();



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
                        MainPhoto = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true) != null ?
                        new PhotoResource
                        {
                            Id = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true).Id,
                            ThumbnailName = itemDish.Dish.Photos.SingleOrDefault(p => p.IsMain == true).ThumbnailName,
                            IsMain = true
                        } :
                        null
                    }
                )))
                .ForMember(mir => mir.Ordered, opt => opt.Ignore())
                .AfterMap((mi, mir) =>
                {
                    if (mi.Orders != null)
                        mir.Ordered = mi.Orders.Where(omi => omi.Order.StatusId == 1).Sum(omi => omi.Amount);
                });

            CreateMap<Cart, CartResource>();
            CreateMap<CartItem, CartItemResource>();
            CreateMap<Cart, UpdateCartResource>();
            CreateMap<CartItem, UpdateCartItemResource>()
                .ForMember(ucir => ucir.Available, opt => opt.MapFrom(ci => ci.MenuItem.Available));
            CreateMap<Address, AddressResource>();
            CreateMap<User, UserCustomerResource>();
            CreateMap<User, UpdateUserResource>();
            CreateMap<Order, OrderResource>();
            CreateMap<OrderedItem, OrderedItemResource>();
            CreateMap<Order, OrderAdminViewResource>();
            CreateMap<Order, UpdateOrderResource>();
            CreateMap<Status, StatusResource>();


            CreateMap<Cart, Order>()
                .ForMember(o => o.Id, opt => opt.Ignore())
                .ForMember(o => o.Items, opt => opt.Ignore())
                .ForMember(o => o.Total, opt => opt.Ignore())
                .AfterMap((c, o) =>
                {
                    decimal sum = 0;
                    foreach (var item in c.Items)
                    {
                        sum += item.MenuItem.Price * item.Amount;
                        o.Items.Add(new OrderedItem
                        {
                            Name = item.MenuItem.Dishes.Count == 1 ? item.MenuItem.Dishes.ElementAt(0).Dish.Name : "Zestaw dnia",
                            Amount = item.Amount,
                            Price = item.MenuItem.Price
                        });
                        o.MenuItems.Add(new OrderMenuItem
                        {
                            MenuItemId = item.MenuItemId,
                            Amount = item.Amount
                        });
                    }

                    o.Date = DateTime.Now;
                    o.Total = sum;
                });
        }
    }
}
