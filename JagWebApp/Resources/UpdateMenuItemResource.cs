using DataAnnotationsExtensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class UpdateMenuItemResource
    {
        [Min(0)]
        [Required]
        public decimal Price { get; set; }

        [Min(0)]
        [Required]
        public int Available { get; set; }
    }
}
