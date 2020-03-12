import { Component, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { AuthService } from './services/auth.service';
import { NAV_MENU_BUTTONS } from './consts/app.consts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit {
    @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
    @ViewChild(MatSidenavContainer, { static: false }) sidenavContainer: MatSidenavContainer;

    menuButtons = NAV_MENU_BUTTONS;
    menuButtonsForUser = NAV_MENU_BUTTONS.filter(btn => btn.role !== 'admin');
    offset: number = 0;

    constructor(private authService: AuthService, private ref: ChangeDetectorRef) { }

    ngAfterViewInit() {
        this.sidenavContainer.scrollable.elementScrolled().subscribe(() => {
            this.offset = this.sidenavContainer.scrollable.measureScrollOffset('top');
            this.ref.detectChanges();
        });
    }

    isAdmin() {
        if (!this.authService.loggedIn())
            return false;

        return this.authService.isAdmin();
    }

    close() {
        this.sidenav.close();
    }

    scrollToTop() {
        document.getElementById('sidenavContent').scrollTo({ behavior: 'smooth', top: 0 });
    }
}
