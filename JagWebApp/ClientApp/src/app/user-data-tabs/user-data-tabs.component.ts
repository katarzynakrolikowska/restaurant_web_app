import { Component } from '@angular/core';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-user-data-tabs',
  templateUrl: './user-data-tabs.component.html',
  styleUrls: ['./user-data-tabs.component.css']
})
export class UserDataTabsComponent {

  constructor(private authService: AuthService) { }
}
