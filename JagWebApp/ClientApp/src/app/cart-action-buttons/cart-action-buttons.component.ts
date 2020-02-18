import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItemsService } from '../services/cart-items.service';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { Subscription } from 'rxjs';
import { Cart } from '../models/cart';

@Component({
  selector: 'app-cart-action-buttons',
  templateUrl: './cart-action-buttons.component.html',
  styleUrls: ['./cart-action-buttons.component.css']
})
export class CartActionButtonsComponent implements OnInit {
    menuItemQuantity: number = 0;
    cart: Cart;
    subscription: Subscription;

    @Input('menu-item-id') menuItemId: number;
    @Input('available') available: number;

    constructor(
        private cartService: CartService,
        private cartItemService: CartItemsService,
        private cartItemsSharedService: CartItemsSharedService) { }

    ngOnInit(): void {
        this.subscription = this.cartItemsSharedService.cartContent$
            .subscribe(result => {
                this.cart = result;
                this.initMenuItemQuantity();
            });
        this.subscription.unsubscribe();
    }

    addItemToCart() {
        !this.cartId ? this.createNewCart() : this.addNewItemToCart();
    }

    addAnotherItemToCart() {
        this.addNewItemToCart();
    }

    removeItemFromCart() {
        this.cartItemService.delete(this.menuItemId)
            .subscribe((result: Cart) => {
                if (!result)
                    localStorage.removeItem('cartId');

                this.cart = result;
                this.shareCartItemAction(false);
          });
    }
    
    get cartId() {
        return localStorage.getItem('cartId');
    }

    private createNewCart() {
        this.cartService.create(this.menuItemId)
            .subscribe((result: Cart) => {
                this.cart = result;
                localStorage.setItem('cartId', result.id.toString());
                this.shareCartItemAction(true);
            });
    }

    private addNewItemToCart() {
        this.cartItemService.createOrUpdate(this.menuItemId)
            .subscribe((result: Cart) => {
                this.cart = result; 
                this.shareCartItemAction(true);
            });
    }

    private shareCartItemAction(isAdded: boolean) {
        if (isAdded) {
            this.menuItemQuantity++;
            this.cartItemsSharedService.shareCartItemAdded(true);
        } else {
            this.menuItemQuantity--;
            this.cartItemsSharedService.shareCartItemAdded(false);
        }

        this.cartItemsSharedService.shareCart(this.cart);
    }

    private initMenuItemQuantity() {
        if (!this.cart)
            return;

        let item = this.cart.items.find(ci => ci.menuItem.id === this.menuItemId);
        if (item)
            this.menuItemQuantity = item.amount;
    }
}
