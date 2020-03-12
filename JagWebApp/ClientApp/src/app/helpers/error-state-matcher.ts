import { ErrorStateMatcher } from "@angular/material";
import { FormGroupDirective, FormControl, NgForm } from "@angular/forms";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null): boolean {
        return !!(control && control.invalid && (control.dirty || control.touched));
    }
}

export class MismatchErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        return !!(control && form.hasError('mismatch') && (control.dirty || control.touched));
    }
}
