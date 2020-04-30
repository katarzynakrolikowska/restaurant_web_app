import { AbstractControl } from "@angular/forms";
import { map } from "rxjs/operators";
import { AuthService } from "shared/services/auth.service";


export class EmailValidators {
  static shouldBeUnique(authService: AuthService) {
    return (control: AbstractControl) => {
      if (control.value) {
        return authService.userExists(control.value)
          .pipe(map((isExist: boolean) => {
            if (authService.loggedIn() && control.value === authService.userEmail)
              return null;

            return isExist ? { shouldBeUnique: true } : null;
          }));
      };
    };
  }
}
