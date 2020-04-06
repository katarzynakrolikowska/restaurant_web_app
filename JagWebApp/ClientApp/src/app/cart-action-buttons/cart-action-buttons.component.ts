import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { CART_ID } from '../consts/app.consts';
import { Cart } from '../models/cart';
import { SaveCart } from '../models/save-cart';
import { AuthService } from '../services/auth.service';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart-action-buttons',
  templateUrl: './cart-action-buttons.component.html',
  styleUrls: ['./cart-action-buttons.component.css']
})
export class CartActionButtonsComponent implements OnInit, OnChanges, OnDestroy {
  menuItemQuantity: number = 0;
  cart: Cart;
  subscription: Subscription;
  userId: number;

  @Input('menu-item-id') menuItemId: number;
  @Input('available') available: number;

  constructor(
    private cartService: CartService,
    private cartItemsSharedService: CartItemsSharedService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.subscription = this.cartItemsSharedService.cartContent$
      .subscribe(cart => {
        this.cart = cart;
        this.initUserId();
        this.initMenuItemQuantity();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.available || this.menuItemQuantity === 0) 
      return;

    if (this.menuItemQuantity > changes.available.currentValue)
      this.cart.items.find(ci => ci.menuItem.id === this.menuItemId).amount = changes.available.currentValue;
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

  removeItemFromCart(newMenuItemQuantity?: number) {
    let menuItemQuantity = newMenuItemQuantity ? newMenuItemQuantity : this.menuItemQuantity - 1;
    let index = this.cart.items.findIndex(ci => ci.menuItem.id === this.menuItemId);
    let patchCart = menuItemQuantity === 0 
      ? [this.getPatchOperationTest(index), { op: 'remove', path: `/items/${index}` }]
      : [
          this.getPatchOperationTest(index), 
          { op: 'replace', path: `/items/${index}/amount`, value: menuItemQuantity }
        ];
        
    this.update(patchCart, false);
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
      .subscribe(cart => {
        this.cart = cart;

        if (!this.userId) 
          localStorage.setItem(CART_ID, this.cart.id.toString());

        this.shareCartItemAction(true);
      });
  }

  private addNewItemToCart() {
    let index = this.cart.items.findIndex(ci => ci.menuItem.id === this.menuItemId);
    let patchCart = index < 0 
      ? [{ op: 'add', path: `/items/-`, value: { menuItemId: this.menuItemId, amount: 1 } }] 
      : [
          this.getPatchOperationTest(index),
          { op: 'replace', path: `/items/${index}/amount`, value: this.menuItemQuantity + 1 }
        ];
        
    this.update(patchCart, true);
  }

  private getPatchOperationTest(index) {
    return {op: 'test', path: `/items/${index}/menuItemId`, value: this.menuItemId };
  }

  private update(patchCart, itemAdded: boolean) {
    this.cartService.update(patchCart, this.cart.id)
    .subscribe(cart => {
      if (cart)
        cart.items.sort((a, b) => a.id - b.id); 
      this.cart = cart; 
      this.shareCartItemAction(itemAdded);

      if (!cart && !this.userId)
          localStorage.removeItem(CART_ID);
    }, (error:HttpErrorResponse) => { console.log(error) });
  }

  private shareCartItemAction(isAdded: boolean) {
    isAdded ? this.menuItemQuantity++ : this.menuItemQuantity--;

    this.cartItemsSharedService.shareCartItemAdded(isAdded);
    this.cartItemsSharedService.shareCart(this.cart);
  }

  private initMenuItemQuantity() {
    if (!this.cart) {
      this.menuItemQuantity = 0;
      return;
    }

    let item = this.cart.items.find(ci => ci.menuItem.id === this.menuItemId);
    if (item)
      this.menuItemQuantity = item.amount;
  }
}
