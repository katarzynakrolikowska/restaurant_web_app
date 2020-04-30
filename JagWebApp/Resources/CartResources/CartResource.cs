using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources.CartResources
{
    public class CartResource
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public ICollection<CartItemResource> Items { get; set; }

        public CartResource()
        {
            Items = new Collection<CartItemResource>();
        }
    }
}
