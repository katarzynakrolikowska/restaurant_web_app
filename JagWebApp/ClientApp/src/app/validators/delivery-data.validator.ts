import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Customer } from './../models/customer';

export function deliveryDataRequired(customer: Customer): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return customer ? null : { deliveryDataRequired: true };
  }
}