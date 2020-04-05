using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources
{
    public class SaveCategoryResource
    {
        [Required]
        [MaxLength(255)]
        public string Name { get; set; }
    }
}
