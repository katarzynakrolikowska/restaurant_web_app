import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WARNING_INVALID_CLAIMS } from 'shared/consts/user-messages.consts';
import { AuthService } from 'shared/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotAdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  canActivate(): boolean {
    if (!this.authService.isAdmin())
      return true;

    this.toastr.warning(WARNING_INVALID_CLAIMS);
    this.router.navigate(['']);
    return false;
  }
}
