import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart';

@Component({
  selector: 'app-nav-cart-button',
  templateUrl: './nav-cart-button.component.html',
  styleUrls: ['./nav-cart-button.component.css']
})
export class NavCartButtonComponent implements OnInit, OnDestroy {
    
    subscription: Subscription;
    cart: Cart;
    cartItemsQuantity: number = 0;

    constructor(
        private cartService: CartService,
        private cartItemsSharedService: CartItemsSharedService) { }

    ngOnInit() {
        let cartId = localStorage.getItem('cartId');

        if (cartId) {
            this.cartService.getCart(cartId)
                .subscribe((result: Cart) => {
                    this.cart = result;
                    this.cart.items.forEach(ci => this.cartItemsQuantity += ci.amount);
                    this.cartItemsSharedService.shareCart(this.cart);
                });
        }

        this.subscription = this.cartItemsSharedService.itemAddedContent$
            .subscribe((isAdded: Boolean) => 
                isAdded ? this.cartItemsQuantity++ : this.cartItemsQuantity--);

        this.subscription.add(this.cartItemsSharedService.cartContent$
            .subscribe((result: Cart) => this.cart = result));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
