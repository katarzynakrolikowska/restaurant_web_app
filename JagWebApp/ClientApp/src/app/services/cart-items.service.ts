import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SaveCart } from '../models/save-cart';


@Injectable({
  providedIn: 'root'
})
export class CartItemsService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getCartItemsCount(cartId) {
        return this.http.get(this.baseUrl + 'api/cartItems/count/' + cartId)
            .pipe(map(result => result));
            
    }

    createOrUpdate(cartItem: SaveCart) {
        return this.http.post(this.baseUrl + 'api/cartItems', cartItem)
            .pipe(map(result => result));
    }
}
