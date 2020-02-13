import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartItemsService } from '../services/cart-items.service';
import { Subscription } from 'rxjs';
import { CartItemsSharedService } from '../services/cart-items-shared.service';

@Component({
  selector: 'app-nav-cart-button',
  templateUrl: './nav-cart-button.component.html',
  styleUrls: ['./nav-cart-button.component.css']
})
export class NavCartButtonComponent implements OnInit, OnDestroy {
    subscription: Subscription;
    cartItemsCount: number;

    constructor(
        private cartItemsService: CartItemsService,
        private cartItemsSharedService: CartItemsSharedService) { }

    ngOnInit() {
        let cartId = localStorage.getItem('cartId');

        if (cartId) {
            this.cartItemsService.getCartItemsCount(cartId)
                .subscribe((result: number) => this.cartItemsCount = result);

            this.subscription = this.cartItemsSharedService.itemsContent$
                .subscribe((isAdded: boolean) => isAdded ? this.cartItemsCount++ : this.cartItemsCount--);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

}
