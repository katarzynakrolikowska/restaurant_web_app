import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    saveEmail(user: User) {

        return this.http.post(this.baseUrl + 'api/user/email/' + user.id, user)
            .pipe(map((response: any) => {
                if (response) {
                    localStorage.setItem('token', response.token);
                }
                response;
            }));
    }
}
