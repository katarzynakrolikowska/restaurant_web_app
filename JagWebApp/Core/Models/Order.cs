using System;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class Order
    {
        public int Id { get; set; }

        public DateTime Date { get; set; }

        public int UserId { get; set; }

        [Required]
        public User User { get; set; }

        [Required]
        public Collection<OrderedItem> Items { get; set; }

        public decimal Total { get; set; }

        [MaxLength(255)]
        public string Info { get; set; }

        public Order()
        {
            Items = new Collection<OrderedItem>();
        }
    }
}
