using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources
{
    public class UpdateCartResource
    {
        public ICollection<UpdateCartItemResource> Items { get; set; }

        public UpdateCartResource()
        {
            Items = new Collection<UpdateCartItemResource>();
        }
    }
}
