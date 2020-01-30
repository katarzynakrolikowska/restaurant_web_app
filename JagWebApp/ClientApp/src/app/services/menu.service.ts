import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    create(menuItem) {
        return this.http.post(this.baseUrl + 'api/menu', menuItem)
            .pipe(map(response => response));
    }
}
