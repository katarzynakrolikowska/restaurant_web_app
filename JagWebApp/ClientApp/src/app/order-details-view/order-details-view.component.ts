import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { OrderService } from './../services/order.service';

@Component({
  selector: 'app-order-details-view',
  templateUrl: './order-details-view.component.html',
  styleUrls: ['./order-details-view.component.css']
})
export class OrderDetailsViewComponent implements OnInit {
  id: number;
  order$: Observable<Order>;
  
  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute) {
    this.id = +this.route.snapshot.params['id'];
      if (isNaN(this.id) || this.id <= 0) {
        router.navigate(['/user/orders']);
        return;
      }
  }

  ngOnInit() {
    this.order$ = this.orderService.getOrder(this.id);
    this.order$
      .subscribe(
        () => {},
        (() => this.router.navigate(['/user/orders'])));
  }
}
