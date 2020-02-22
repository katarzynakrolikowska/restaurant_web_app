import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItemsService } from '../services/cart-items.service';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { Subscription } from 'rxjs';
import { Cart } from '../models/cart';
import { SaveCart } from '../models/save-cart';
import { AuthService } from '../services/auth.service';
import { CART_ID } from '../consts/app-consts';

@Component({
  selector: 'app-cart-action-buttons',
  templateUrl: './cart-action-buttons.component.html',
  styleUrls: ['./cart-action-buttons.component.css']
})
export class CartActionButtonsComponent implements OnInit, OnDestroy {
    menuItemQuantity: number = 0;
    cart: Cart;
    subscription: Subscription;
    userId: number;

    @Input('menu-item-id') menuItemId: number;
    @Input('available') available: number;

    constructor(
        private cartService: CartService,
        private cartItemService: CartItemsService,
        private cartItemsSharedService: CartItemsSharedService,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.subscription = this.cartItemsSharedService.cartContent$
            .subscribe(result => {
                this.cart = result;
                this.initUserId();
                this.initMenuItemQuantity();
            });
    }

    addItemToCart() {
        this.userId = this.authService.getUserId();

        if (this.userId && this.cart) 
            this.addNewItemToCart()
         else if (this.userId && !this.cart) 
            this.createNewCart();
         else 
            !this.cart ? this.createNewCart() : this.addNewItemToCart();
    }

    addAnotherItemToCart() {
        this.addNewItemToCart();
    }

    removeItemFromCart() {
        this.cartItemService.delete(this.menuItemId, this.cart.id)
            .subscribe((result: Cart) => {
                if (!result && !this.userId)
                    localStorage.removeItem(CART_ID);

                this.cart = result;
                this.shareCartItemAction(false);
            }, () => { });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private initUserId() {
        if (this.cart)
            this.userId = this.cart.userId;
    }

    private createNewCart() {
        let cart: SaveCart = { menuItemId: this.menuItemId };

        this.cartService.create(cart)
            .subscribe((result: Cart) => {
                this.cart = result;

                if (!this.userId) 
                    localStorage.setItem(CART_ID, this.cart.id.toString());

                this.shareCartItemAction(true);
            });
    }

    private addNewItemToCart() {
        this.cartItemService.createOrUpdate(this.menuItemId, this.cart.id)
            .subscribe((result: Cart) => {
                this.cart = result; 
                this.shareCartItemAction(true);
            }, () => {});
    }

    private shareCartItemAction(isAdded: boolean) {
        isAdded ? this.menuItemQuantity++ : this.menuItemQuantity--;

        this.cartItemsSharedService.shareCartItemAdded(isAdded);
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
