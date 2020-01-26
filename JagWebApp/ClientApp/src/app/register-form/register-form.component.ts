import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { passwordsMatch } from '../validators/password.validator';
import { ToastrService } from 'ngx-toastr';
import { EmailValidators } from '../validators/email.validaor';
import { NgxSpinnerService } from 'ngx-spinner';
import {
    ERROR_REQUIRED_MESSAGE,
    ERROR_EMAIL_MESSAGE,
    ERROR_UNIQUE_EMAIL_MESSAGE,
    ERROR_MISMATCH_PASSWORDS_MESSAGE,
    ERROR_CONFIRM_PASSWORD_MESSAGE,
    ERROR_MIN_LENGTH_PASSWORD_MESSAGE,
    ERROR_MAX_LENGTH_PASSWORD_MESSAGE
} from '../user-messages/messages';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

    user: User;
    form: FormGroup;
    @Output() newUserRegistered = new EventEmitter();

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) { }

    
    ngOnInit() {
        this.initForm();

        this.confirmPassword.setValidators(
            [
                Validators.required,
                passwordsMatch(this.password)
            ]
        );
    }

    register() {
        if (this.form.valid) {
            this.spinner.show();
            this.user = Object.assign({}, this.form.value);
            this.authService.register(this.user).subscribe(() => {
                this.spinner.hide();
                this.toastr.success('Rejestracja zakończona sukcesem!');
                this.newUserRegistered.emit(0);
            });
        }
    }

    getEmailErrorMessage() {
        return this.email.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.email.hasError('email') ? ERROR_EMAIL_MESSAGE :
                this.email.hasError('shouldBeUnique') ? ERROR_UNIQUE_EMAIL_MESSAGE :
                '';
    }

    getPasswordErrorMessage() {
        return this.password.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.password.hasError('minlength') ? ERROR_MIN_LENGTH_PASSWORD_MESSAGE :
                this.password.hasError('maxlength') ? ERROR_MAX_LENGTH_PASSWORD_MESSAGE :
                    '';
    }

    getPasswordConfirmErrorMessage() {
        return this.confirmPassword.hasError('required') ? ERROR_CONFIRM_PASSWORD_MESSAGE :
            this.confirmPassword.hasError('mismatch') ? ERROR_MISMATCH_PASSWORDS_MESSAGE :
            '';
    }

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

    get confirmPassword() {
        return this.form.get('confirmPassword');
    }

    private initForm() {
        this.form = new FormGroup({
            email: new FormControl('',
                [
                    Validators.required,
                    Validators.email
                ],
                [
                    EmailValidators.shouldBeUnique(this.authService)
                ]
            ),
            password: new FormControl('',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(20)
                ]),
            confirmPassword: new FormControl(''),
        });
    }
}
