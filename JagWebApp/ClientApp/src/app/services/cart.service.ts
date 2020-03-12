import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SaveCart } from '../models/save-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService { 

    constructor(
        private http: HttpClient,
        @Inject('BASE_URL') private baseUrl: string) { }

    getCart(id) {
        return this.http.get(this.baseUrl + 'api/carts/' + id)
            .pipe(map(result => result));
    }

    getUserCart(userId) {
        return this.http.get(this.baseUrl + 'api/carts/user/' + userId)
            .pipe(map(result => result));
    }

    create(cart: SaveCart) {
        return this.http.post(this.baseUrl + 'api/carts', cart)
            .pipe(map(result => result));
    }

    update() {
        let headers = new HttpHeaders();
        headers = headers.append('content-type', 'application/json');

        return this.http.put(this.baseUrl + 'api/carts/' + this.cartId, null, { headers: headers })
            .pipe(map(result => result));
    }

    delete(cartId) {
        return this.http.delete(this.baseUrl + 'api/carts/' + cartId);
    }

    private get cartId() {
        return localStorage.getItem('cartId');
    }
}
