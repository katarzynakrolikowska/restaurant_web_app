import { Component, Input } from '@angular/core';
import { CartService } from '../services/cart.service';
import { SaveCart } from '../models/save-cart';
import { CartItemsService } from '../services/cart-items.service';
import { CartItemsSharedService } from '../services/cart-items-shared.service';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.css']
})
export class AddToCartButtonComponent {
    @Input('menu-item-id') menuItemId: number;
    @Input('item-available') itemAvailable: boolean;

    constructor(
        private cartService: CartService,
        private cartItemService: CartItemsService,
        private cartItemsSharedService: CartItemsSharedService) { }

    onClick() {
        let cartId = localStorage.getItem('cartId');

        if (!cartId) {
            let cart: SaveCart = { menuItemId: this.menuItemId };
            this.cartService.create(cart)
                .subscribe((result: string) => {
                    localStorage.setItem('cartId', result);
                    this.shareCartItemAdded();
                });
        } else {
            let cartItem: SaveCart = { menuItemId: this.menuItemId, cartId: cartId };
            this.cartItemService.createOrUpdate(cartItem)
                .subscribe(() => this.shareCartItemAdded());
        }
    }

    private shareCartItemAdded() {
        this.cartItemsSharedService.shareCartItems(true);
    }

}
