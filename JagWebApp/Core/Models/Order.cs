using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        [Required]
        public User User { get; set; }

        [Required]
        public Collection<OrderedItem> OrderedItems { get; set; }

        public decimal Total { get; set; }

        [MaxLength(255)]
        public string Info { get; set; }

        public Order()
        {
            OrderedItems = new Collection<OrderedItem>();
        }
    }
}
