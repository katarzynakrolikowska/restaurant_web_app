import { ValidationErrors, ValidatorFn } from "@angular/forms";
import { Customer } from 'shared/models/customer';

export function deliveryDataRequired(customer: Customer): ValidatorFn {
  return (): ValidationErrors | null => customer ? null : { deliveryDataRequired: true };
}