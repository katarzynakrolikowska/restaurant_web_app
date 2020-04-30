import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Customer } from 'shared/models/customer';
import { ChangePasswordView } from '../../membership/models/change-password-view';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getSingle() {
    return this.http.get(this.baseUrl + 'api/users')
      .pipe(map((customer: Customer) => customer));
  }

  updateEmail(patchUser) {
    return this.http.patch(this.baseUrl + 'api/users', patchUser)
      .pipe(map((response: any) => {
        if (response)
          localStorage.setItem('token', response.token);
      }));
  }

  updatePassword(view: ChangePasswordView) {
    return this.http.put(this.baseUrl + 'api/users/password', view);
  }

  update(patchUser) {
    return this.http.patch(this.baseUrl + 'api/users', patchUser);
  }
}
