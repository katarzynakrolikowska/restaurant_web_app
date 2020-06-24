import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Dish } from "shared/models/dish";


export function menuItemMatch(dishes: Dish[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value)
      return null;

    let dishName = control.value.name;
    if (dishes)
      return (dishName && dishes.findIndex(d => d.name === dishName) > -1) ? null : { mismatch: true };
  }
}