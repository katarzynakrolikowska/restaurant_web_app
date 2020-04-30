using JagWebApp.Core.Models.Identity;
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

        public Collection<OrderedItem> Items { get; set; }

        public Collection<OrderMenuItem> MenuItems { get; set; }

        public decimal Total { get; set; }

        [MaxLength(255)]
        public string Info { get; set; }

        [Required]
        public Status Status { get; set; }

        public int StatusId { get; set; }

        public Order()
        {
            Items = new Collection<OrderedItem>();
            MenuItems = new Collection<OrderMenuItem>();
        }
    }
}
