using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Core.Models
{
    public class Cart
    {
        public int Id { get; set; }

        public User User { get; set; }

        public int? UserId { get; set; }

        public ICollection<CartItem> Items { get; set; }

        public Cart()
        {
            Items = new Collection<CartItem>();
        }
    }
}
