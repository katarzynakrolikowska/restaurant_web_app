import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Dish } from "../models/dish";


//export function mainItemDishesExist(dishes: Array<Dish>): ValidatorFn {
//    return (control: AbstractControl): ValidationErrors | null => {
//        if (!control.value)
//            return null;
//        console.log('dishes', dishes.length);
//        console.log('sprawdza', (dishes.length <= 0) ? null : { dishesExist: true })
//        return (dishes.length <= 0) ? null : { dishesExist: true };
//    }
//}

export function menuItemMatch(dishes: Array<Dish>): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value)
            return null;

        let dishName = control.value.name;
        if (dishes)
            return (dishName && dishes.findIndex(d => d.name === dishName) > -1) ? null : { mismatch: true };
    }
}


