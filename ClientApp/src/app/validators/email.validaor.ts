import { AbstractControl, ValidationErrors } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { map } from "rxjs/operators";



export class EmailValidators {
    static shouldBeUnique(authService: AuthService) {
        return (control: AbstractControl) => {
            if (control.value) {

                return authService.userExists(control.value)
                    .pipe(map(result => {
                        if (authService.loggedIn() && control.value === authService.getUserEmail())
                            return null;

                        return result ? { shouldBeUnique: true } : null;
                    }));
            };
        };
    }
}
