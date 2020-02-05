using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Core.Models
{
    public class MenuItemDish
    {
        public Dish Dish { get; set; }

        public int DishId { get; set; }

        public MenuItem MenuItem { get; set; }

        public int MenuItemId { get; set; }
    }
}
