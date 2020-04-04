using JagWebApp.Core.Models;
using System.Collections.ObjectModel;

namespace JagWebApp.Tests.Stubs
{
    class MenuItemStub
    {
        public static MenuItem GetMenuItem()
        {
            return new MenuItem
            {
                Dishes = new Collection<MenuItemDish>
                {
                    new MenuItemDish
                    {
                        DishId = 1,
                        Dish = DishStub.GetDish()
                    }
                },
                Price = 1,
                Available = 1,
                IsMain = true
            };
        }
    }
}
