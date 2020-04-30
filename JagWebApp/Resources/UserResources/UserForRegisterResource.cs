using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Resources.UserResources
{
    public class UserForRegisterResource
    {
        [Required]
        [EmailAddress(ErrorMessage = "Wpisany adres email nie jest poprawny")]
        public string Email { get; set; }

        [Required]
        [StringLength(20, MinimumLength = 6, ErrorMessage = "Hasło powinno zawierać od 6 do 20 znaków")]
        public string Password { get; set; }
    }
}
