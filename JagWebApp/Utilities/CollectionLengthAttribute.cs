using JagWebApp.Resources;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace JagWebApp.Utilities
{
    public class CollectionLengthAttribute : ValidationAttribute
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
