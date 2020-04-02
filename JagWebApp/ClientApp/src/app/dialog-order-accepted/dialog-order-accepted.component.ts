import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-order-accepted',
  templateUrl: './dialog-order-accepted.component.html',
  styleUrls: ['./dialog-order-accepted.component.css']
})
export class DialogOrderAcceptedComponent {
  orderId;

  constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
    this.orderId = data;
  }
}
