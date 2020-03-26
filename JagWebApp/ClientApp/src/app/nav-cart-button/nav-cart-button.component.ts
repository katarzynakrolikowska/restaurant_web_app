import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CART_ID } from '../consts/app.consts';
import { Cart } from '../models/cart';
import { MenuItem } from '../models/menu-item';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartService } from '../services/cart.service';
import { SignalRService } from '../services/signal-r.service';

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
    private cartItemsSharedService: CartItemsSharedService,
    private signalRService: SignalRService) { }

  ngOnInit() {
    let cartId = localStorage.getItem(CART_ID);

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
      this.cartService.updateCartAfterLogIn()
        .subscribe(cart => {
          this.cart = cart
          this.setCartItemsQuantity();
          this.shareCart();
          localStorage.removeItem(CART_ID);
        });
    } else if (this.userId && this.cartItemsQuantity === 0) {
      this.cartService.getUserCart(this.userId)
        .subscribe(cart => {
          this.cart = cart;
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

  private initCart(cartId) {
    this.cartService.getCart(cartId)
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
      .subscribe((item: MenuItem) => {
        if (!this.cart)
          return;

        let index = this.cart.items.findIndex(ci => ci.menuItem.id === item.id);
        if (index < 0)
          return;

        this.cart.items[index].menuItem = item;
        this.shareCart();
      }));

    this.subscription.add(this.signalRService.onDeletedItemReceived
      .subscribe((item: MenuItem) => {
        if (!this.cart)
          return;

        let index = this.cart.items.findIndex(ci => ci.menuItem.id === item.id);
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

  private removeCart() {
    this.cartService.delete(this.cart.id)
      .subscribe(() => {
        this.cart = null;

        if (localStorage.getItem(CART_ID))
          localStorage.removeItem(CART_ID);

        this.shareCart();
        this.setCartItemsQuantity();
      });
  }
}
