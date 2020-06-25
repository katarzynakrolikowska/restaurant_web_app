import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Cart } from 'shared/models/cart';
import { MenuItem } from 'shared/models/menu-item';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { CartService } from 'shared/services/cart.service';
import { SignalRService } from 'shared/services/signal-r.service';

@Component({
  selector: 'app-nav-cart-button',
  templateUrl: './nav-cart-button.component.html',
  styleUrls: []
})
export class NavCartButtonComponent implements OnInit, OnDestroy, OnChanges {
  subscription: Subscription;
  cart: Cart;
  cartItemsQuantity: number = 0;

  @Input('user-id') userId: number;

  constructor(
    private cartService: CartService,
    private cartItemsSharedService: CartItemsSharedService,
    private signalRService: SignalRService) { }

  ngOnInit() {
    const cartId = this.cartService.cartId;

    if (cartId)
      this.initCart(cartId)

    this.subscription = this.cartItemsSharedService.cartContent$
      .subscribe((cart: Cart) => {
        this.cart = cart;
        this.setCartItemsQuantity();
      });

    this.subscription.add(this.cartItemsSharedService.itemAddedContent$
      .subscribe((isAdded: Boolean) => isAdded ? this.cartItemsQuantity++ : this.cartItemsQuantity--));

    this.setUpSignalRConnection();
  }

  ngOnChanges(): void {
    if (this.userId && this.cartItemsQuantity > 0) {
      this.cartService.updateCartAfterLogin()
        .subscribe(cart => {
          this.cart = cart
          this.setCartItemsQuantity();
          this.shareCart();
          this.cartService.removeCartId();
        });
    } 
    else if (this.userId && this.cartItemsQuantity === 0) {
      this.cartService.getUserCart()
        .subscribe(
          cart => {
            this.cart = cart;
            this.setCartItemsQuantity();
            this.shareCart();
          },
          (errorResponse: HttpErrorResponse) => {
            if (errorResponse.status !== 404)
              throw new Error();
          });
    } 
    else {
      this.cart = null;
      this.cartItemsQuantity = 0;
      this.shareCart();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initCart(cartId) {
    this.cartService.getSingle(cartId)
      .subscribe(cart => {
        this.cart = cart;
        this.setCartItemsQuantity();
        this.shareCart();
      });
  }

  private setCartItemsQuantity() {
    this.cartItemsQuantity = 0;
    if (this.cart)
       this.cart.items.forEach(ci => this.cartItemsQuantity += ci.amount);
  }

  private shareCart() {
    this.cartItemsSharedService.shareCart(this.cart);
  }

  private setUpSignalRConnection() {
    if (!this.signalRService.isConnected()) {
      this.signalRService.startConnection();
      this.signalRService.addTransferUpdatedItemListener();
      this.signalRService.addTransferDeletedItemListener();
    }

    this.subscription.add(this.signalRService.onUpdatedItemReceived
      .subscribe((items: MenuItem[]) => {
        if (!this.cart)
          return;

        items.forEach(mi => this.updateCart(mi))
        this.shareCart();
      }));

    this.subscription.add(this.signalRService.onDeletedItemReceived
      .subscribe((item: MenuItem) => {
        if (!this.cart)
          return;

        const index = this.cart.items.findIndex(ci => ci.menuItem.id === item.id);
        if (index < 0)
          return;

        this.cart.items.splice(index, 1);

        if (this.cart.items.length === 0)
          this.removeCart();
        else {
          this.shareCart();
          this.setCartItemsQuantity();
        }
      }));
  }

  private updateCart(item: MenuItem) {
    const index = this.cart.items.findIndex(ci => ci.menuItem.id === item.id);
    if (index < 0)
      return;

    this.cart.items[index].menuItem = item;
    if (this.cart.items[index].amount === 0)
      this.cart.items.splice(index, 1);
  }

  private removeCart() {
    this.cartService.delete(this.cart.id)
      .subscribe(() => {
        this.cart = null;

        if (this.cartService.cartId)
          this.cartService.removeCartId();

        this.shareCart();
        this.setCartItemsQuantity();
      });
  }
}
