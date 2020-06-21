using DataAnnotationsExtensions;
using JagWebApp.Core.Models;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources.MenuItemResources
{
    public class UpdateMenuItemResource
    {
        public ICollection<int> Dishes { get; set; }

        [Min(0)]
        [Required]
        public decimal Price { get; set; }

        [Min(0)]
        [Required]
        public int Available { get; set; }

        public UpdateMenuItemResource()
        {
            Dishes = new Collection<int>();
        }
    }
}
