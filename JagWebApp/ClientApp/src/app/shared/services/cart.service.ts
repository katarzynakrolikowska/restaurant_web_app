import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CART_ID } from 'shared/consts/app.consts';
import { Cart } from 'shared/models/cart';
import { SaveCart } from '../../shopping/models/save-cart';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnInit { 
  headers: HttpHeaders;

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit(): void {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append('content-type', 'application/json');
  }

  getSingle(id) {
    return this.http.get(this.baseUrl + 'api/carts/' + id)
      .pipe(map((result: Cart) => result));
  }

  getUserCart() {
    return this.http.get(this.baseUrl + 'api/carts/user')
      .pipe(map((result: Cart) => result));
  }

  create(cart: SaveCart) {
    return this.http.post(this.baseUrl + 'api/carts', cart)
      .pipe(map((result: Cart) => result));
  }

  updateCartAfterLogin() {
    return this.http.put(this.baseUrl + 'api/carts/' + this.cartId, null, { headers: this.headers })
      .pipe(map((result: Cart) => result));
  }

  update(patchCart, cartId) {
    return this.http.patch(this.baseUrl + 'api/carts/' + cartId, patchCart, { headers: this.headers })
      .pipe(map((result: Cart) => result));
  }

  delete(cartId) {
    return this.http.delete(this.baseUrl + 'api/carts/' + cartId);
  }

  get cartId() {
    return localStorage.getItem(CART_ID);
  }

  set cartId(cartId: string) {
    localStorage.setItem(CART_ID, cartId);
  }

  removeCartId() {
    localStorage.removeItem(CART_ID);
  }
}
