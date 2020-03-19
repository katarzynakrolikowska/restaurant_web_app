import { AbstractControl } from "@angular/forms";
import { map } from "rxjs/operators";
import { AuthService } from "../services/auth.service";


export class EmailValidators {
  static shouldBeUnique(authService: AuthService) {
    return (control: AbstractControl) => {
      if (control.value) {
        return authService.userExists(control.value)
          .pipe(map((isExist: boolean) => {
            if (authService.loggedIn() && control.value === authService.getUserEmail())
              return null;

            return isExist ? { shouldBeUnique: true } : null;
          }));
      };
    };
  }
}
