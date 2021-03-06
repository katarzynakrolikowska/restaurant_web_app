import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Order } from 'shared/models/order';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';

@Component({
  selector: 'app-order-details-view',
  templateUrl: './order-details-view.component.html',
  styleUrls: []
})
export class OrderDetailsViewComponent implements OnInit {
  id: number;
  order: Order;
  routerLink: string;
  
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService) {
    this.routerLink = authService.isAdmin() ? '/admin/orders' : '/user/orders';

    this.id = +this.route.snapshot.params['id'];
      if (isNaN(this.id) || this.id <= 0) {
        router.navigate([this.routerLink]);
        return;
      }
  }

  ngOnInit() {
    this.spinner.show();
    this.orderService.getUserOrder(this.id)
      .subscribe(
        order => this.order = order,
        (() => this.router.navigate([this.routerLink])),
        () => this.spinner.hide()
      );
  }

  changeStatus() {
    let patchDoc = [
      { op: "replace", path: "/statusId", value: "2" }
    ];

    this.orderService.update(patchDoc, this.id)
      .subscribe(() => this.router.navigate(['/admin/orders']));
  }
}
