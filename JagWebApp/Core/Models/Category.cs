using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
    }
}