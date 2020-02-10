using DataAnnotationsExtensions;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class MenuItemResource
    {
        public int Id { get; set; }

        public ICollection<DishResource> Dishes { get; set; }

        public decimal Price { get; set; }

        public int Limit { get; set; }

        public int Available { get; set; }

        public bool IsMain { get; set; }

        public MenuItemResource()
        {
            Dishes = new Collection<DishResource>();
        }
    }
}
