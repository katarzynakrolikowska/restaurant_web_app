import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { NAV_MENU_BUTTONS } from './shared/consts/app.consts';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  @ViewChild(MatSidenavContainer, { static: false }) sidenavContainer: MatSidenavContainer;

  menuButtonsForAdmin = NAV_MENU_BUTTONS;
  menuButtonsForUser = NAV_MENU_BUTTONS.filter(btn => btn.role !== 'admin');
  buttons: any;
  offset: number = 0;

  constructor(
    private authService: AuthService, 
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn() && this.authService.token)
      this.authService.removeToken();

    this.buttons = this.authService.isAdmin() ? this.menuButtonsForAdmin : this.menuButtonsForUser;
  }

  ngAfterViewInit() {
    this.sidenavContainer.scrollable.elementScrolled()
      .subscribe(() => {
        this.offset = this.sidenavContainer.scrollable.measureScrollOffset('top');
        this.ref.detectChanges();
      });
  }

  close() {
    this.sidenav.close();
  }

  scrollToTop() {
    document.getElementById('sidenavContent').scrollTo({ behavior: 'smooth', top: 0 });
  }
}
