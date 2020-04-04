using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Core.Models
{
    public class Status
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
    }
}
