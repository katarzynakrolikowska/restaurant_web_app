import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ROLE_ADMIN, TOKEN } from 'shared/consts/app.consts';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  login(model: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/auth/login', model)
      .pipe(map((response: any) => {
        if (response) {
          localStorage.setItem(TOKEN, response.token);
          this.decodedToken = this.jwtHelper.decodeToken(response.token);
        }
      }));
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'api/auth/register', model);
  }

  userExists(email: string) {
    return this.http.get(this.baseUrl + 'api/auth/' + email);
  }

  loggedIn() {
    let token = this.token;
    return !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin() {
    if (!this.loggedIn())
      return false;

    this.decodeToken();
    let roles = this.decodedToken.role as Array<string>;

    if (roles) 
      return roles.includes(ROLE_ADMIN);

    return false;
  }

  get token() {
    return localStorage.getItem(TOKEN);
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
  }

  get userId() {
    if (!this.loggedIn())
      return;

    this.decodeToken();
    return this.decodedToken.nameid;
  }

  get userEmail() {
    if (!this.loggedIn())
      return;

    this.decodeToken();
    return this.decodedToken.email;
  }

  decodeToken() {
    let token = this.token;
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }
}
