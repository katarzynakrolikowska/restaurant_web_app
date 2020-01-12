import { Component, OnInit, ViewChild } from '@angular/core';
import { RegisterFormComponent } from '../register-form/register-form.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { FormGroup, AbstractControl } from '@angular/forms';

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

        if (this.step === 0 && this.loginComponent)
            this.loginComponent.form.reset();

        if (this.step === 1) {
            this.registerComponent.form.reset();

            
        }
        
    }

   

}
