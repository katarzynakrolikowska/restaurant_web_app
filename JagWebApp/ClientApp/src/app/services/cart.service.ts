import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SaveCart } from '../models/save-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService { 

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    create(cart: SaveCart) {
        return this.http.post(this.baseUrl + 'api/carts', cart)
            .pipe(map(result => result));
    }
}
