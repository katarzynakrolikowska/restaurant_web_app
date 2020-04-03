using System;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources
{
    public class OrderAdminViewResource
    {
        public int Id { get; set; }

        public UpdateUserResource User { get; set; }

        public DateTime Date { get; set; }

        public Collection<OrderedItemResource> Items { get; set; }

        public decimal Total { get; set; }

        public string Info { get; set; }

        public OrderAdminViewResource()
        {
            Items = new Collection<OrderedItemResource>();
        }
    }
}
