import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {
    step = 0;

    @ViewChild(RegisterFormComponent, { static: false })
    private registerComponent: RegisterFormComponent;

    @ViewChild(LoginFormComponent, { static: false })
    private loginComponent: LoginFormComponent;

    constructor() { }

    ngOnInit() {
    }

    setStep(index: number) {
        this.step = index;

        if (this.step === 0 && this.loginComponent) {
            this.loginComponent.form.reset();
            this.loginComponent.email.setErrors(null);
            this.loginComponent.password.setErrors(null);
        }
            

        if (this.step === 1 && this.registerComponent) {
            this.registerComponent.form.reset();
            this.registerComponent.email.setErrors(null);
            this.registerComponent.password.setErrors(null);
            this.registerComponent.confirmPassword.setErrors(null);

        }
    }
}
