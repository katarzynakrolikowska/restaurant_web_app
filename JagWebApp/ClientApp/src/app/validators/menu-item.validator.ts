import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Dish } from "../models/dish";


export function menuItemMatch(dishes: Array<Dish>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let dishName = control.value.name;
        if (dishes)
            return (dishName && dishes.findIndex(d => d.name === dishName) > -1) ? null : { mismatch: true };
    }
}
