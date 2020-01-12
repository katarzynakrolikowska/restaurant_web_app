import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

    isAdmin() {
        this.decodeToken();
        let roles = this.decodedToken.role as Array<string>;

        if (roles) {
            return roles.includes('Admin');
        }

        return false;
    }

    decodeToken() {
        let token = localStorage.getItem('token');
        this.decodedToken = this.jwtHelper.decodeToken(token);
    }
}
