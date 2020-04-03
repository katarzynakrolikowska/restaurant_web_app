import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Order } from '../models/order';
import { OrderService } from './../services/order.service';

@Component({
  selector: 'app-user-orders-view',
  templateUrl: './user-orders-view.component.html',
  styleUrls: ['./user-orders-view.component.css']
})
export class UserOrdersViewComponent implements OnInit {
  orders: Array<Order> = [];
  displayedColumns: string[] = ['id', 'date', 'total', 'more'];
  dataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(
    private orderService: OrderService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.orderService.getUserOrders()
      .subscribe(orders => {
        this.orders = orders;
        this.dataSource = new MatTableDataSource<Order>(this.orders);

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.spinner.hide();
      });
  }
}
