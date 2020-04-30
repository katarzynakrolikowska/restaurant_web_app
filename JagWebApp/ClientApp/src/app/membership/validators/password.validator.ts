import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function passwordsMatch(
  controlFirstPassword: AbstractControl,
  controlSecondPassword: AbstractControl): ValidatorFn {
  return (): ValidationErrors | null => {
    if (controlFirstPassword && controlSecondPassword)
      return controlFirstPassword.value === controlSecondPassword.value ? null : { 'mismatch': true };
  }
}
