import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
    form: FormGroup;
    user: User;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit() {
        this.initForm();
    }

    login() {
        if (this.form.valid) {
            this.user = Object.assign({}, this.form.value);
            this.authService.login(this.user).subscribe(() => {
                this.toastr.success('Zalogowano!');
                this.router.navigate(['/']);
            }, (errorRespone: HttpErrorResponse) => {
                    if (errorRespone.status == 401) {
                        console.log(errorRespone);//log
                        this.toastr.error('Nieprawidłowy login lub hasło');
                    } else {
                        this.toastr.error('Wystapił nieoczekiwany błąd');
                    }
            });
        }
    }

    get email() {
        return this.form.get('email');
    }

    get password() {
        return this.form.get('password');
    }

    private initForm() {
        this.form = new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }
}
