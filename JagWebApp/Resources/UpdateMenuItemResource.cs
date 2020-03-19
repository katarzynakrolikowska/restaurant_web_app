using DataAnnotationsExtensions;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources
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
    }
}
