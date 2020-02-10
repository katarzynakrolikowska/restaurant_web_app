import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    
    isExpanded = false;
    menuRouterLink: string;

    constructor(private authService: AuthService,  private toastr: ToastrService) { }
    
    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    loggedIn() {
        return this.authService.loggedIn();
    }

    logout() {
        localStorage.removeItem('token');
        this.toastr.info("Zostałeś wylogowany");
    }

    isAdmin() {
        if (!this.loggedIn())
            return false;

        return this.authService.isAdmin();
    }
}
