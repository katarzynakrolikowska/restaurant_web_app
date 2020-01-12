import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { passwordsMatch } from '../validators/password.validator';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailValidators } from '../validators/email.validaor';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

    user: User;
    form: FormGroup;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService
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
            this.user = Object.assign({}, this.form.value);
            this.authService.register(this.user).subscribe(() => {
                this.toastr.success('Rejestracja zakończona sukcesem!');
            });
        }
        console.log(this.form);
    }

    getEmailErrorMessage() {
        return this.email.hasError('required') ? 'To pole jest obowiązkowe' :
            this.email.hasError('email') ? 'Wpisany adres email jest nie poprawny' :
            this.email.hasError('shouldBeUnique') ? 'Istnieje konto przypisane do podanego adresu email' :
                '';
    }

    getPasswordErrorMessage() {
        return this.password.hasError('required') ? 'To pole jest obowiązkowe' :
            this.password.hasError('minlength') ? 'Hasło jest za krótkie' :
                this.password.hasError('maxlength') ? 'Hasło jest za długie' :
                    '';
    }

    getPasswordConfirmErrorMessage() {
        return this.confirmPassword.hasError('required') ? 'Potwierdź hasło' :
            this.confirmPassword.hasError('mismatch') ? 'Wpisane hasła nie są identyczne' :
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
