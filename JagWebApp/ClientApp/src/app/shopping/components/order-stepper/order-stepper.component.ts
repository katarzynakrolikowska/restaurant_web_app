import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ERROR_SERVER_MESSAGE } from 'shared/consts/user-messages.consts';
import { Cart } from 'shared/models/cart';
import { CartItem } from 'shared/models/cart-item';
import { Customer } from 'shared/models/customer';
import { Order } from 'shared/models/order';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { OrderService } from 'shared/services/order.service';
import { UserService } from 'shared/services/user.service';
import { SaveOrder } from '../../models/save-order';
import { deliveryDataRequired } from '../../validators/delivery-data.validator';
import { DialogOrderAcceptedComponent } from '../dialog-order-accepted/dialog-order-accepted.component';

@Component({
  selector: 'app-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrls: ['./order-stepper.component.css']
})
export class OrderStepperComponent implements OnInit, OnDestroy {
  customer: Customer;
  form: FormGroup;
  subscription: Subscription;
  cart: Cart;

  constructor(
    private userService: UserService, 
    private cartItemsSharedService: CartItemsSharedService, 
    private router: Router,
    private orderService: OrderService,
    public dialog: MatDialog,
    public toastr: ToastrService) { }

  ngOnInit() {
    this.userService.getSingle()
      .subscribe(customer => {
        this.customer = customer;
        if (this.customer && this.form)
          this.form.clearValidators();
      });

    this.form = new FormGroup(
      { additionalInfo: new FormControl('') },
      deliveryDataRequired(this.customer));

      this.subscription = this.cartItemsSharedService.cartContent$
        .subscribe(cart => {
          this.cart = cart;
          if (!cart)
            this.router.navigate(['/menu']);
        });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getDishName(cartItem: CartItem) {
    return cartItem.menuItem.dishes.length > 1 ? 'Zestaw dnia' : cartItem.menuItem.dishes[0].name;
  }

  getCartItemSum(cartItem: CartItem) {
    return cartItem.amount * cartItem.menuItem.price;
  }

  getCartSum() {
    let sum = 0;

    this.cart.items.forEach(item => sum += item.menuItem.price * item.amount);
    return sum;
  }

  orderMenu() {
    if (this.form.invalid)
      return;

    let order: SaveOrder = { info: this.form.get('additionalInfo').value }

    this.orderService.create(order)
      .subscribe(order => {
        this.showDialog(order);
        this.cartItemsSharedService.shareCart(null);
      }, (errorRespone: HttpErrorResponse) => {
        if (errorRespone.status === 404) {
          this.toastr.error('Wygląda na to, że produkty z Twojego koszyka zostały już wyprzedane :(');
          this.cart = null;
          this.cartItemsSharedService.shareCart(null);
        } else
          this.toastr.error(ERROR_SERVER_MESSAGE);
      });
  }

  private showDialog(order: Order) {
    const dialogRef = this.dialog.open(
      DialogOrderAcceptedComponent,
      { data: order });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/menu']);
    });
  }
}
