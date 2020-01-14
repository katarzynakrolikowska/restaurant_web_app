import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordsMatch } from '../validators/password.validator';
import { ChangePasswordView } from '../models/changePasswordView';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-edit-password-form',
  templateUrl: './edit-password-form.component.html',
  styleUrls: ['./edit-password-form.component.css']
})
export class EditPasswordFormComponent implements OnInit {
    form: FormGroup;
    view: ChangePasswordView;
    errorMessage: string;
    invalid: boolean = false;

    constructor(
        private userService: UserService,
        private toastr: ToastrService,
        private authService: AuthService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.initForm();

        this.confirmPassword.setValidators(
            [
                Validators.required,
                passwordsMatch(this.newPassword)
            ]
        );
    }

    savePassword() {
        if (this.form.valid) {
            this.spinner.show();
            let id = this.authService.getUserId();

            this.view = Object.assign({}, this.form.value);
            this.userService.savePassword(this.view, id)
                .subscribe(() => {
                    this.invalid = false;
                    this.spinner.hide();
                    this.toastr.success('Dane zostały zmienione');
                }, (error: HttpErrorResponse) => {
                    this.invalid = true;
                    this.spinner.hide();

                    if (error.status === 400)
                        this.errorMessage = 'To nie jest Twoje stare hasło';
                    else
                        this.errorMessage = 'Coś poszło nie tak';
                });

            this.form.reset();
            this.currentPassword.setErrors(null);
            this.newPassword.setErrors(null);
            this.confirmPassword.setErrors(null);

        }
    }

    getCurrentPasswordErrorMessage() {
        
        return this.currentPassword.hasError('required') ? 'Wpisz obecne hasło' :
            '';
    }

    getNewPasswordErrorMessage() {
        return this.newPassword.hasError('required') ? 'To pole jest obowiązkowe' :
            this.newPassword.hasError('minlength') ? 'Hasło jest za krótkie' :
                this.newPassword.hasError('maxlength') ? 'Hasło jest za długie' :
                    '';
    }

    getPasswordConfirmErrorMessage() {
        return this.confirmPassword.hasError('required') ? 'Potwierdź hasło' :
            this.confirmPassword.hasError('mismatch') ? 'Wpisane hasła nie są identyczne' :
                '';
    }

    get currentPassword() {
        return this.form.get('currentPassword');
    }

    get newPassword() {
        return this.form.get('newPassword');
    }

    get confirmPassword() {
        return this.form.get('confirmPassword');
    }

    private initForm() {
        this.form = new FormGroup({
            currentPassword: new FormControl('',
                [
                    Validators.required
                ]),
            newPassword: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(20)
                ]),
            confirmPassword: new FormControl(''),
        });
    }

}
