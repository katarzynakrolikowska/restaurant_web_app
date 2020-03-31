import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function notEmptyInput(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value && control.value.trim() === '')
      return { empty: true };

    return null;
  }
}