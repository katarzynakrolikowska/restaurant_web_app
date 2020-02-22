import { Component, OnInit, OnDestroy, OnChanges, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartService } from '../services/cart.service';
import { Cart } from '../models/cart';
import { CART_ID } from '../consts/app-consts';

@Component({
  selector: 'app-nav-cart-button',
  templateUrl: './nav-cart-button.component.html',
  styleUrls: ['./nav-cart-button.component.css']
})
export class NavCartButtonComponent implements OnInit, OnDestroy, OnChanges {
    subscription: Subscription;
    cart: Cart;
    cartItemsQuantity: number = 0;

    @Input('user-id') userId: number;

    constructor(
        private cartService: CartService,
        private cartItemsSharedService: CartItemsSharedService) { }

    ngOnInit() {
        let cartId = localStorage.getItem(CART_ID);

        if (cartId) {
            this.cartService.getCart(cartId)
                .subscribe((result: Cart) => {
                    this.cart = result;
                    this.setCartItemsQuantity();
                    this.shareCart();
                });
        }
        this.subscription = this.cartItemsSharedService.itemAddedContent$
            .subscribe((isAdded: Boolean) =>
                isAdded ? this.cartItemsQuantity++ : this.cartItemsQuantity--);

        this.subscription.add(this.cartItemsSharedService.cartContent$
            .subscribe((result: Cart) => this.cart = result));
    }

    ngOnChanges(): void {
        if (this.userId && this.cartItemsQuantity > 0) {
            this.cartService.update()
                .subscribe((result: Cart) => {
                    this.cart = result
                    this.setCartItemsQuantity();
                    this.shareCart();
                    localStorage.removeItem(CART_ID);
                });
        } else if (this.userId && this.cartItemsQuantity === 0) {
            this.cartService.getUserCart(this.userId)
                .subscribe((result: Cart) => {
                    this.cart = result;
                    this.setCartItemsQuantity();
                    this.shareCart();
                });
        } else {
            this.cart = null;
            this.cartItemsQuantity = 0;
            this.shareCart();
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private setCartItemsQuantity() {
        this.cartItemsQuantity = 0;
        if (this.cart)
           this.cart.items.forEach(ci => this.cartItemsQuantity += ci.amount);
    }

    private shareCart() {
        this.cartItemsSharedService.shareCart(this.cart);
    }
}
