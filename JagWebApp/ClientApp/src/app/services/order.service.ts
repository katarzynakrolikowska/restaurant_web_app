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

  create(order: SaveOrder){
    return this.http.post(this.baseUrl + 'api/orders', order)
      .pipe(map((order: Order) => order));
  }
}
