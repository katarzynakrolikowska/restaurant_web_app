using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources.OrderResources
{
    public class SaveOrderResource
    {
        [MaxLength(255)]
        public string Info { get; set; }
    }
}
