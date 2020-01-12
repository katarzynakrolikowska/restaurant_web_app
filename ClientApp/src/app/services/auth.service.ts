import { Injectable, Inject } from '@angular/core';
import { extend } from 'webdriver-js-extender';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    jwtHelper = new JwtHelperService();
    decodedToken: any;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    login(model: any) {
        return this.http.post(this.baseUrl + 'api/auth/login', model)
            .pipe(map((response: any) => {
                if (response) {
                    localStorage.setItem('token', response.token);
                    this.decodedToken = this.jwtHelper.decodeToken(response.token);
                }
                response;
            }));
    }

    register(model: any) {
        return this.http.post(this.baseUrl + 'api/auth/register', model)
            .pipe(map((response) => response));
    }

    userExists(email: string) {
        return this.http.get(this.baseUrl + 'api/auth/' + email)
            .pipe(map((response) => response));
    }

    loggedIn() {
        let token = localStorage.getItem('token');
        return !this.jwtHelper.isTokenExpired(token);
    }

    roleMatch(allowedRoles): boolean {
        let isMatch = false;

        if (!this.loggedIn())
            return false;

        

        const userRoles = this.decodedToken.role as Array<string>;
        if (userRoles) {
            allowedRoles.forEach(item => {
                if (userRoles.includes(item)) {
                    isMatch = true;
                    return;
                }
            });
        }

        return isMatch;
    }

    decodeToken() {
        let token = localStorage.getItem('token');
        this.decodedToken = this.jwtHelper.decodeToken(token);
    }
}
