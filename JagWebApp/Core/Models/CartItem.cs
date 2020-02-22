using DataAnnotationsExtensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Core.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public MenuItem MenuItem { get; set; }

        public int MenuItemId { get; set; }

        [Min(1)]
        public int Amount { get; set; }

        public int CartId { get; set; }
    }
}
