import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Category } from '../models/category';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getCategories() {
    return this.http.get(this.baseUrl + 'api/dishCategories')
      .pipe(map((categories: any) => categories));
  }

  save(categoryName: string) {
    return this.http.post(this.baseUrl + 'api/dishCategories', { name: categoryName })
      .pipe(map((category: Category) => category));
  }

  update(category: Category) {
    return this.http.put(this.baseUrl + 'api/dishCategories/' + category.id , category);
  }

  remove(id: number) {
    return this.http.delete(this.baseUrl + 'api/dishCategories/' + id);
  }
}
