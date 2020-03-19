import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ERROR_EMAIL_OR_PASSWORD_MESSAGE, ERROR_SERVER_MESSAGE, SUCCESS_LOG_IN_MESSAGE } from '../consts/user-messages.consts';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { finalize } from 'rxjs/operators';

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

      this.authService.login(this.user)
        .pipe(finalize(() => this.spinner.hide()))
        .subscribe(
          () => {
            this.errorLogin = false;
            this.toastr.success(SUCCESS_LOG_IN_MESSAGE);
            let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
            this.router.navigate([returnUrl || '/']);
          }, 
          (errorRespone: HttpErrorResponse) => {
            this.errorLogin = true;
            errorRespone.status == 401 ?
              this.errorMessage = ERROR_EMAIL_OR_PASSWORD_MESSAGE :
              this.errorMessage = ERROR_SERVER_MESSAGE;
          }
        );
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
