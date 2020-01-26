import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dish } from '../models/dish';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    createDish(dish: Dish) {
        return this.http.post(this.baseUrl + 'api/dishes', dish)
            .pipe(map(result => result));
    }

    getDishes() {
        return this.http.get(this.baseUrl + 'api/dishes')
            .pipe(map((result: Array<Dish>) => result));
    }

    getDish(id: number) {
        return this.http.get(this.baseUrl + 'api/dishes/' + id)
            .pipe(map((result: Dish) => result));
    }

    deleteDish(id: number) {
        return this.http.delete(this.baseUrl + 'api/dishes/' + id)
            .pipe(map(result => result));
    }

    updateDish(dish: Dish) {
        return this.http.put(this.baseUrl + 'api/dishes/' + dish.id, dish)
            .pipe(map(result => result));
    }
}
