import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ERROR_INVALID_USER_PASSWORD, ERROR_MAX_LENGTH_PASSWORD_MESSAGE, ERROR_MIN_LENGTH_PASSWORD_MESSAGE, ERROR_MISMATCH_PASSWORDS_MESSAGE, ERROR_REQUIRED_MESSAGE, ERROR_SERVER_MESSAGE, SUCCESS_SAVE_DATA_MESSAGE } from 'src/app/shared/consts/user-messages.consts';
import { CustomErrorStateMatcher, MismatchErrorStateMatcher } from 'src/app/shared/helpers/error-state-matcher';
import { UserService } from 'src/app/shared/services/user.service';
import { ChangePasswordView } from '../../models/change-password-view';
import { passwordsMatch } from '../../validators/password.validator';


@Component({
  selector: 'app-edit-password-form',
  templateUrl: './edit-password-form.component.html',
  styleUrls: []
})
export class EditPasswordFormComponent implements OnInit {
  form: FormGroup;
  changePasswordView: ChangePasswordView;
  errorMessage: string;
  invalid: boolean = false;
  matcher = new CustomErrorStateMatcher();
  mismatchErrorMatcher = new MismatchErrorStateMatcher();

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.initForm();
    this.form.setValidators(passwordsMatch(this.newPassword, this.confirmPassword));
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

  savePassword() {
    if (this.form.invalid)
      return;

    this.spinner.show();
    this.changePasswordView = Object.assign({}, this.form.value);

    this.userService.updatePassword(this.changePasswordView)
      .subscribe(
        () => {
          this.invalid = false;
          this.spinner.hide();
          this.toastr.success(SUCCESS_SAVE_DATA_MESSAGE);
        }, 
        (error: HttpErrorResponse) => {
          this.invalid = true;
          this.spinner.hide();

          error.status === 400 ? this.errorMessage = ERROR_INVALID_USER_PASSWORD : this.errorMessage = ERROR_SERVER_MESSAGE;
        }
      );

    this.form.reset();
  }

  getCurrentPasswordErrorMessage() {
    return this.currentPassword.hasError('required') ? 'Wpisz obecne hasło' : '';
  }

  getNewPasswordErrorMessage() {
    return this.newPassword.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.newPassword.hasError('minlength') 
        ? ERROR_MIN_LENGTH_PASSWORD_MESSAGE 
        : this.newPassword.hasError('maxlength') 
          ? ERROR_MAX_LENGTH_PASSWORD_MESSAGE 
          : '';
  }

  getMismatchErrorMessage() {
    return ERROR_MISMATCH_PASSWORDS_MESSAGE;
  }

  private initForm() {
    this.form = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      confirmPassword: new FormControl(''),
    });
  }
}
