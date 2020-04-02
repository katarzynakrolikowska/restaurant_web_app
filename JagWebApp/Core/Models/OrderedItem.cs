using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class OrderedItem
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public decimal Price { get; set; }

        public int Amount { get; set; }
    }
}
