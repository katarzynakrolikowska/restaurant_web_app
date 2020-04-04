using System;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources
{
    public class OrderResource
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public Collection<OrderedItemResource> Items { get; set; }

        public decimal Total { get; set; }

        public string Info { get; set; }

        public StatusResource Status { get; set; }

        public OrderResource()
        {
            Items = new Collection<OrderedItemResource>();
        }
    }
}
