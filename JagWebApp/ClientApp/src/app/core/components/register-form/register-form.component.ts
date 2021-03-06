import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/membership/models/user';
import { EmailValidators } from 'src/app/membership/validators/email.validaor';
import { passwordsMatch } from 'src/app/membership/validators/password.validator';
import { ERROR_EMAIL_MESSAGE, ERROR_MAX_LENGTH_PASSWORD_MESSAGE, ERROR_MIN_LENGTH_PASSWORD_MESSAGE, ERROR_MISMATCH_PASSWORDS_MESSAGE, ERROR_REQUIRED_MESSAGE, ERROR_UNIQUE_EMAIL_MESSAGE, SUCCESS_REGISTER_MESSAGE } from 'src/app/shared/consts/user-messages.consts';
import { MismatchErrorStateMatcher } from 'src/app/shared/helpers/error-state-matcher';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: []
})
export class RegisterFormComponent implements OnInit {
  user: User;
  form: FormGroup;
  mismatchErrorMatcher = new MismatchErrorStateMatcher();

  @Output('onNewUserRegistered') onNewUserRegistered = new EventEmitter();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }
  
  ngOnInit() {
    this.initForm();
    this.form.setValidators(passwordsMatch(this.password, this.confirmPassword));
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

  register() {
    if (this.form.invalid)
      return;

    this.spinner.show();
    this.user = Object.assign({}, this.form.value);
    this.authService.register(this.user)
      .subscribe(() => {
        this.spinner.hide();
        this.toastr.success(SUCCESS_REGISTER_MESSAGE);
        this.onNewUserRegistered.emit(0);
      });
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.email.hasError('email') 
        ? ERROR_EMAIL_MESSAGE 
        : this.email.hasError('shouldBeUnique') 
          ? ERROR_UNIQUE_EMAIL_MESSAGE 
          : '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.password.hasError('minlength') 
        ? ERROR_MIN_LENGTH_PASSWORD_MESSAGE 
        : this.password.hasError('maxlength') 
          ? ERROR_MAX_LENGTH_PASSWORD_MESSAGE 
          : '';
  }

  getMismatchErrorMessage() {
    return ERROR_MISMATCH_PASSWORDS_MESSAGE;
  }

  private initForm() {
    this.form = new FormGroup({
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [EmailValidators.shouldBeUnique(this.authService)]
      ),
      password: new FormControl(
        '', 
        [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl(''),
    });
  }
}
