import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { NgxSpinnerService } from 'ngx-spinner';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-admin-orders-view',
  templateUrl: './admin-orders-view.component.html',
  styleUrls: ['./../../user-orders-view/user-orders-view.component.css']
})
export class AdminOrdersViewComponent implements OnInit {
  orders: Array<Order> = [];
  displayedColumns: string[] = ['no', 'id', 'user', 'date', 'total', 'status', 'more'];
  dataSource: MatTableDataSource<Order>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(
    private orderService: OrderService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.orderService.getOrders()
      .subscribe(orders => {
        this.orders = orders;
        this.dataSource = new MatTableDataSource<Order>(this.orders);

        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'status': return item.status.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.spinner.hide();
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) 
      this.dataSource.paginator.firstPage();
  }

  private nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) 
          search = this.nestedFilterCheck(search, data[key], k);
      }
    } else 
      search += data[key];
    
    return search;
  }
}
