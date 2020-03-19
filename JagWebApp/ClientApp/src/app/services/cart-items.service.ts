import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Cart } from '../models/cart';


@Injectable({
  providedIn: 'root'
})
export class CartItemsService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  createOrUpdate(menuItemId: number, cartId: number) {
    return this.http.post(this.baseUrl + 'api/carts/' + cartId + '/item', menuItemId)
      .pipe(map((result: Cart) => result));
  }

  delete(menuItemId: number, cartId: number) {
    return this.http.delete(this.baseUrl + 'api/carts/' + cartId + '/item/' + menuItemId)
      .pipe(map((result: Cart) => result));
  }
}
