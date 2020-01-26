import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { passwordsMatch } from '../validators/password.validator';
import { ChangePasswordView } from '../models/changePasswordView';
import { UserService } from '../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    SUCCESS_SAVE_DATA_MESSAGE,
    ERROR_SERVER_MESSAGE,
    ERROR_REQUIRED_MESSAGE,
    ERROR_MISMATCH_PASSWORDS_MESSAGE,
    ERROR_CONFIRM_PASSWORD_MESSAGE,
    ERROR_MIN_LENGTH_PASSWORD_MESSAGE,
    ERROR_MAX_LENGTH_PASSWORD_MESSAGE
} from '../user-messages/messages';


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
                    this.toastr.success(SUCCESS_SAVE_DATA_MESSAGE);
                }, (error: HttpErrorResponse) => {
                    this.invalid = true;
                    this.spinner.hide();

                    if (error.status === 400)
                        this.errorMessage = 'To nie jest Twoje stare hasło';
                    else
                        this.errorMessage = ERROR_SERVER_MESSAGE;
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
        return this.newPassword.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.newPassword.hasError('minlength') ? ERROR_MIN_LENGTH_PASSWORD_MESSAGE :
                this.newPassword.hasError('maxlength') ? ERROR_MAX_LENGTH_PASSWORD_MESSAGE :
                    '';
    }

    getPasswordConfirmErrorMessage() {
        return this.confirmPassword.hasError('required') ? ERROR_CONFIRM_PASSWORD_MESSAGE :
            this.confirmPassword.hasError('mismatch') ? ERROR_MISMATCH_PASSWORDS_MESSAGE :
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
