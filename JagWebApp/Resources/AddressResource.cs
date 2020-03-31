using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources
{
    public class AddressResource
    {
        [Required]
        [MaxLength(150)]
        public string CustomerName { get; set; }

        [Required]
        [MaxLength(50)]
        public string Street { get; set; }

        [Required]
        [MaxLength(10)]
        public string HouseNumber { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{2}-[0-9]{3}$", ErrorMessage = "Niepoprawny kod pocztowy")]
        public string Postcode { get; set; }

        [Required]
        [MaxLength(50)]
        public string City { get; set; }
    }
}
