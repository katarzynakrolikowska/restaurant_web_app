using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Resources
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
