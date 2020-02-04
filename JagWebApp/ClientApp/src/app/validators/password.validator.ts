import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function passwordsMatch(password: AbstractControl): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (password)
            return password.value === control.value ? null : { 'mismatch': true };
    }
}
