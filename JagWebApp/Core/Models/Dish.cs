using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class Dish
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }

        public int Amount { get; set; }

        public int CategoryId { get; set; }

        [Required]
        public Category Category { get; set; }

        public ICollection<Photo> Photos { get; set; }

        public Dish()
        {
            Photos = new Collection<Photo>();
        }
    }
}
