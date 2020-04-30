using JagWebApp.Resources.MenuItemResources;
using System.ComponentModel.DataAnnotations;

namespace JagWebApp.Utilities
{
    public class DishesLengthAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var menuItem = (SaveMenuItemResource)validationContext.ObjectInstance;
            if (menuItem.Dishes.Count < 1)
                return new ValidationResult("Niepoprawne dane");

            return ValidationResult.Success;
        }
    }
}
