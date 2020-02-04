using DataAnnotationsExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class SaveMenuItemResource
    {
        public int Id { get; set; }

        public int DishId { get; set; }

        [Min(0)]
        public decimal Price { get; set; }

        [Min(0)]
        public int Limit { get; set; }
    }
}
