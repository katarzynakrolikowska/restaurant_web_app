using JagWebApp.Resources.UserResources;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace JagWebApp.Resources.OrderResources
{
    public class OrderAdminViewResource
    {
        public int Id { get; set; }

        public UpdateUserResource User { get; set; }

        public DateTime Date { get; set; }

        public ICollection<OrderedItemResource> Items { get; set; }

        public decimal Total { get; set; }

        public string Info { get; set; }

        public StatusResource Status { get; set; }

        public OrderAdminViewResource()
        {
            Items = new Collection<OrderedItemResource>();
        }
    }
}
