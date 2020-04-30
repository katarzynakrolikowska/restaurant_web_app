import { Component, Input, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NAV_MENU_BUTTONS } from 'shared/consts/app.consts';
import { AuthService } from 'shared/services/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  menuButtons = NAV_MENU_BUTTONS;
  menuButtonsForUser = NAV_MENU_BUTTONS.filter(btn => btn.role !== 'admin');

  @Input('sidenav') sidenav;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.matIconRegistry.addSvgIcon(
      'doll',
      this.domSanitizer.bypassSecurityTrustResourceUrl('doll.svg')
    );
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

  logout() {
    this.authService.removeToken();
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
