import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart, getCartSum } from 'shared/models/cart';
import { Dish } from 'shared/models/dish';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { CartService } from 'shared/services/cart.service';
import { getCartItemSum, CartItem } from 'shared/models/cart-item';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.css']
})
export class CartViewComponent implements OnInit, OnDestroy {
  cart: Cart;
  subscription: Subscription;

  constructor(
    private cartService: CartService,
    private cartItemsSharedService: CartItemsSharedService) { }

  ngOnInit() {
    this.subscription = this.cartItemsSharedService.cartContent$
      .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getPhotoName(dish: Dish) {
    return dish.mainPhoto ? 'uploads/' + dish.mainPhoto.thumbnailName : 'defaults/default-4.png';
  }

  getCartItemSum(item: CartItem) {
    return getCartItemSum(item);
  }

  getCartSum() {
    return getCartSum(this.cart);
  }

  clearCart() {
    this.cartService.delete(this.cart.id)
      .subscribe(() => {
        if (this.cartService.cartId)
          this.cartService.removeCartId();

        this.cart = null;
        this.cartItemsSharedService.shareCart(this.cart);
      });
  }
}
