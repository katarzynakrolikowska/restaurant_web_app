using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources
{
    public class ChangePasswordViewModelResource
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Hasło powinno zawierać od 6 do 20 znaków")]
        public string NewPassword { get; set; }
    }
}
