using JagWebApp.Resources.CartResources;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Utilities
{
    public class NoExceedAvailableAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var cartItem = (UpdateCartItemResource)validationContext.ObjectInstance;

            if (cartItem.MenuItemId > 0 && cartItem.Amount > cartItem.Available)
                return new ValidationResult("Brak dostepnych porcji");

            return ValidationResult.Success;
        }
    }
}
