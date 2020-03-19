using DataAnnotationsExtensions;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Core.Models
{
    public class MenuItem
    {
        public int Id { get; set; }

        public ICollection<MenuItemDish> Dishes { get; set; }

        public decimal Price { get; set; }

        [Min(0)]
        public int Limit { get; set; }

        [Min(0)]
        public int Available { get; set; }

        public bool IsMain { get; set; }

        public MenuItem()
        {
            Dishes = new Collection<MenuItemDish>();
        }
    }
}
