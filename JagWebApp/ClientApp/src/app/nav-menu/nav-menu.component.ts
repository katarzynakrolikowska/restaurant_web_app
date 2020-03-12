import { Component, Input } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NAV_MENU_BUTTONS } from '../consts/app.consts';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    
    isExpanded = false;
    menuButtons = NAV_MENU_BUTTONS;
    menuButtonsForUser = NAV_MENU_BUTTONS.filter(btn => btn.role !== 'admin');

    @Input('sidenav') sidenav;

    constructor(
        private authService: AuthService,
        private toastr: ToastrService,
        private router: Router) { }

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
        this.router.navigate(['/']);
    }

    isAdmin() {
        if (!this.loggedIn())
            return false;

        return this.authService.isAdmin();
    }

    close() {
        this.sidenav.close();
    }
}
