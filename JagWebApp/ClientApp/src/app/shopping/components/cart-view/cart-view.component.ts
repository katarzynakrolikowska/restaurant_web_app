import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart } from 'shared/models/cart';
import { Dish } from 'shared/models/dish';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { CartService } from 'shared/services/cart.service';

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

  get cartValue() {
    let value = 0;

    this.cart.items.forEach(item => value += item.menuItem.price * item.amount);
    return value;
  }

  getPhotoName(dish: Dish) {
    return dish.mainPhoto ? 'uploads/' + dish.mainPhoto.thumbnailName : 'defaults/default-4.png';
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
