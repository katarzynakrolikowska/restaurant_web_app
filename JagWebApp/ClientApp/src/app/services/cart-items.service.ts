import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartItemsService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    createOrUpdate(menuItemId: number) {
        return this.http.post(this.baseUrl + 'api/carts/' + this.cartId + '/items', menuItemId)
            .pipe(map(result => result));
    }

    delete(menuItemId: number) {
        return this.http.delete(this.baseUrl + 'api/carts/' + this.cartId + '/items/' + menuItemId)
            .pipe(map(result => result));
    }

    get cartId() {
        return localStorage.getItem('cartId');
    }
}
