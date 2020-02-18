import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService { 

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getCart(id) {
        return this.http.get(this.baseUrl + 'api/carts/' + id)
            .pipe(map(result => result));
    }

    create(menuItemId) {
        return this.http.post(this.baseUrl + 'api/carts', menuItemId)
            .pipe(map(result => result));
    }

}
