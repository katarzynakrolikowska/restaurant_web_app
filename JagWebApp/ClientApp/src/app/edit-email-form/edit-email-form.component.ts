import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { EmailValidators } from '../validators/email.validaor';
import { User } from '../models/user';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-email-form',
  templateUrl: './edit-email-form.component.html',
  styleUrls: ['./edit-email-form.component.css']
})
export class EditEmailFormComponent implements OnInit {
    form: FormGroup;
    user: User = {
        id: this.authService.getUserId(),
        email: this.authService.getUserEmail()
    }

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private userService: UserService,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.form = new FormGroup({
            email: new FormControl(
                this.user.email,
                [Validators.required, Validators.email],
                [EmailValidators.shouldBeUnique(this.authService)]
            ),
        });
    }

    get email() {
        return this.form.get('email');
    }

    getEmailErrorMessage() {
        return this.email.hasError('required') ? 'To pole jest obowiązkowe' :
            this.email.hasError('email') ? 'Wpisany adres email jest nie poprawny' :
                this.email.hasError('shouldBeUnique') ? 'Istnieje konto przypisane do podanego adresu email' :
                    '';
    }

    saveEmail() {
        if (this.form.valid) {
            this.spinner.show();

            this.user.email = this.email.value;
            this.userService.saveEmail(this.user).subscribe(() => {
                this.spinner.hide();
                this.toastr.success('Dane zostały zmienione');
            });
        }
    }

}
