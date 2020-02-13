using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
{
    public class CartResource
    {
        public int Id { get; set; }

        public ICollection<CartItemResource> Items { get; set; }

        public CartResource()
        {
            Items = new Collection<CartItemResource>();
        }
    }
}
