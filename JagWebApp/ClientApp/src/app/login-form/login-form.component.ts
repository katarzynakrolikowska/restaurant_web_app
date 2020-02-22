import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ERROR_SERVER_MESSAGE } from '../user-messages/messages';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
    form: FormGroup;
    user: User;
    errorLogin = false;
    errorMessage: string;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    login() {
        if (this.form.valid) {
            this.spinner.show();
            this.user = Object.assign({}, this.form.value);

            this.authService.login(this.user).subscribe(() => {
                this.spinner.hide();
                this.errorLogin = false;
                this.toastr.success('Zalogowano!');
                let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                this.router.navigate([returnUrl || '/']);
            }, (errorRespone: HttpErrorResponse) => {
                    this.spinner.hide();
                    this.errorLogin = true;

                    errorRespone.status == 401 ?
                        this.errorMessage = 'Nieprawidłowy email lub hasło.' :
                        this.errorMessage = ERROR_SERVER_MESSAGE;
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
