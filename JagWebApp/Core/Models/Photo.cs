using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class Photo
    {
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [Required]
        [StringLength(255)]
        public string ThumbnailName { get; set; }

        public int DishId { get; set; }

        public bool IsMain { get; set; }
    }
}
