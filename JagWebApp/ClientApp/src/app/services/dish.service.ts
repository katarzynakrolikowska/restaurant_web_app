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
}
