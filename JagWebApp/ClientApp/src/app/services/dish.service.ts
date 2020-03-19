import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Dish } from '../models/dish';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getDishes() {
    return this.http.get(this.baseUrl + 'api/dishes')
      .pipe(map((result: Array<Dish>) => result));
  }

  getDish(id: number) {
    return this.http.get(this.baseUrl + 'api/dishes/' + id)
      .pipe(map((result: Dish) => result));
  }

  createDish(dish: Dish) {
    return this.http.post(this.baseUrl + 'api/dishes', dish);
  }

  updateDish(dish: Dish) {
    return this.http.put(this.baseUrl + 'api/dishes/' + dish.id, dish);
  }

  deleteDish(id: number) {
    return this.http.delete(this.baseUrl + 'api/dishes/' + id);
  }
}
