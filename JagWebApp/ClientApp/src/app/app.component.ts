import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav, MatSidenavContainer } from '@angular/material';
import { NAV_MENU_BUTTONS } from './consts/app.consts';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
  @ViewChild(MatSidenavContainer, { static: false }) sidenavContainer: MatSidenavContainer;

  menuButtons = NAV_MENU_BUTTONS;
  menuButtonsForUser = NAV_MENU_BUTTONS.filter(btn => btn.role !== 'admin');
  offset: number = 0;

  constructor(private authService: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    let token = localStorage.getItem('token');
    if (!this.authService.loggedIn() && token)
      localStorage.removeItem('token');
  }

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
