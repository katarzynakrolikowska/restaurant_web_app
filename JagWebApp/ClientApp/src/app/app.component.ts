import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { AuthService } from './services/auth.service';
import { NAV_MENU_BUTTONS } from './consts/app.consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
    @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

    menuButtons = NAV_MENU_BUTTONS;
    menuButtonsForUser = NAV_MENU_BUTTONS.filter(btn => btn.role !== 'admin');
    title = 'app';

    constructor(private authService: AuthService) { }

    isAdmin() {
        if (!this.authService.loggedIn())
            return false;

        return this.authService.isAdmin();
    }

    close() {
        this.sidenav.close();
    }
}
