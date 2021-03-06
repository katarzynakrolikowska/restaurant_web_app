﻿using JagWebApp.Resources.DishResources;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources.MenuItemResources
{
    public class MenuItemResource
    {
        public int Id { get; set; }

        public ICollection<DishResource> Dishes { get; set; }

        public decimal Price { get; set; }

        public int Ordered { get; set; }

        public int Available { get; set; }

        public bool IsMain { get; set; }

        public MenuItemResource()
        {
            Dishes = new Collection<DishResource>();
        }
    }
}
