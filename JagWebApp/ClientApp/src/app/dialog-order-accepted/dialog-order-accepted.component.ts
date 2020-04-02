import { Order } from './../models/order';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-order-accepted',
  templateUrl: './dialog-order-accepted.component.html',
  styleUrls: ['./dialog-order-accepted.component.css']
})
export class DialogOrderAcceptedComponent {
  order: Order;

  constructor(@Inject(MAT_DIALOG_DATA) public data) {
    this.order = data;
  }
}
