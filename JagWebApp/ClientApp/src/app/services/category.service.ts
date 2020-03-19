import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getCategories() {
    return this.http.get(this.baseUrl + 'api/dishCategories')
      .pipe(map((response: any) => response));
  }
}
