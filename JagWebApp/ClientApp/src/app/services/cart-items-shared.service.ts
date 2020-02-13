import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartItemsSharedService {
    private cartItemsSource = new Subject<boolean>();

    constructor() { }

    shareCartItems(isAdded: boolean): void {
        this.cartItemsSource.next(isAdded);
    }

    get itemsContent$() {
        return this.cartItemsSource.asObservable();
    }
}
