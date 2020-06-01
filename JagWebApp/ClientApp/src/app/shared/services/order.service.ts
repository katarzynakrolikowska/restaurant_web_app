import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { SaveOrder } from '../../shopping/models/save-order';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getUserOrder(id: number) {
    return this.http.get(this.baseUrl + 'api/orders/' + id)
      .pipe(map((order: Order) => order))
  }

  getAll() {
    return this.http.get(this.baseUrl + 'api/orders/')
    .pipe(map((orders: Array<Order>) => this.getSortedArray(orders)));
  }

  getUserOrders() {
    return this.http.get(this.baseUrl + 'api/orders/user')
      .pipe(map((orders: Array<Order>) => this.getSortedArray(orders)));
  }

  create(order: SaveOrder){
    return this.http.post(this.baseUrl + 'api/orders', order)
      .pipe(map((order: Order) => order));
  }

  update(patchDoc, orderId: number) {
    return this.http.patch(this.baseUrl + 'api/orders/' + orderId, patchDoc);
  }

  private getSortedArray(array: Array<any>) {
    return array.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
