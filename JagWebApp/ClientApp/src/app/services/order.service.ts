import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SaveOrder } from '../models/save-order';
import { Order } from './../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getOrder(id: number) {
    return this.http.get(this.baseUrl + 'api/orders/' + id)
      .pipe(map((order: Order) => order))
  }

  getUserOrders() {
    return this.http.get(this.baseUrl + 'api/orders/user')
      .pipe(map((orders: Array<Order>) => 
        orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())));
  }

  create(order: SaveOrder){
    return this.http.post(this.baseUrl + 'api/orders', order)
      .pipe(map((order: Order) => order));
  }
}
