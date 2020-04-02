using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources
{
    public class SaveOrderResource
    {
        [MaxLength(255)]
        public string Info { get; set; }
    }
}
