import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Cart } from 'shared/models/cart';

@Injectable({
  providedIn: 'root'
})
export class CartItemsSharedService {
  private cart: Cart;
  private cartItemSource = new Subject<boolean>();
  private cartSource = new BehaviorSubject<Cart>(this.cart);

  constructor() { }

  shareCartItemAdded(isAdded: boolean): void {
    this.cartItemSource.next(isAdded);
  }

  shareCart(cart: Cart): void {
    this.cartSource.next(cart);
  }

  get itemAddedContent$() {
    return this.cartItemSource.asObservable();
  }

  get cartContent$() {
    return this.cartSource.asObservable();
  }
}
