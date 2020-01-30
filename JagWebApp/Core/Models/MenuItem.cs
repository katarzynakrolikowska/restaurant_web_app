using DataAnnotationsExtensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Core.Models
{
    public class MenuItem
    {
        public int Id { get; set; }

        [Required]
        public Dish Dish { get; set; }

        public int DishId { get; set; }

        [Min(0)]
        public int Limit { get; set; }

        [Min(0)]
        public int Available { get; set; }
    }
}
