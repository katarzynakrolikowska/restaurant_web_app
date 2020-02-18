import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Cart } from '../models/cart';

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
