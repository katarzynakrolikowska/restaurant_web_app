import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Dish } from 'shared/models/dish';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getAll() {
    return this.http.get(this.baseUrl + 'api/dishes')
      .pipe(map((result: Array<Dish>) => result));
  }

  getSingle(id: number) {
    return this.http.get(this.baseUrl + 'api/dishes/' + id)
      .pipe(map((result: Dish) => result));
  }

  create(dish: Dish) {
    return this.http.post(this.baseUrl + 'api/dishes', dish);
  }

  update(dish: Dish) {
    return this.http.put(this.baseUrl + 'api/dishes/' + dish.id, dish);
  }

  delete(id: number) {
    return this.http.delete(this.baseUrl + 'api/dishes/' + id);
  }
}
