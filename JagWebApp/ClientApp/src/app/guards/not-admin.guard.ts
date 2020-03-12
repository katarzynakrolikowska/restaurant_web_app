import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

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

        this.toastr.warning("Brak dostępu");
        this.router.navigate(['']);
        return false;
    }

}
