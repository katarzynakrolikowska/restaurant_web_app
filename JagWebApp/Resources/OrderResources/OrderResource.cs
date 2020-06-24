using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources.OrderResources
{
    public class OrderResource
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public ICollection<OrderedItemResource> Items { get; set; }

        public decimal Total { get; set; }

        public string Info { get; set; }

        public StatusResource Status { get; set; }

        public OrderResource()
        {
            Items = new Collection<OrderedItemResource>();
        }
    }
}
