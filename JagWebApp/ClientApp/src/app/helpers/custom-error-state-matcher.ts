import { ErrorStateMatcher } from "@angular/material";
import { FormGroupDirective, FormControl, NgForm } from "@angular/forms";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}
