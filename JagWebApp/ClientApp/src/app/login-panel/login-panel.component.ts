import { Component } from '@angular/core';

@Component({
  selector: 'app-login-panel',
  templateUrl: './login-panel.component.html',
  styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent {
  step = 0;

  constructor() { }

  setStep(index: number) {
    this.step = index;
  }
}
