import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ChangePasswordView } from '../models/change-password-view';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  saveEmail(patchUser) {
    return this.http.patch(
      this.baseUrl + 'api/user/email', patchUser)
      .pipe(map((response: any) => {
        if (response)
          localStorage.setItem('token', response.token);
      }));
  }

  savePassword(view: ChangePasswordView) {
    return this.http.put(this.baseUrl + 'api/user/password', view);
  }
}
