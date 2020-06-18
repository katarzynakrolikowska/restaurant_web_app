import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { MenuItem } from '../models/menu-item';
import { UpdateMenuItem } from '../models/update-menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getAll() {
    return this.http.get(this.baseUrl + 'api/menu')
      .pipe(map((response: Array<MenuItem>) => response));
  }

  getSingle(itemId: number) {
    return this.http.get(this.baseUrl + 'api/menu/' + itemId)
      .pipe(map((response: MenuItem) => response));
  }

  getMainItem() {
    return this.http.get(this.baseUrl + 'api/menu/main')
      .pipe(map((response: MenuItem) => response));
  }

  create(menuItem) {
    return this.http.post(this.baseUrl + 'api/menu', menuItem);
  }

  update(id: number, updateMenuItem: UpdateMenuItem) {
    return this.http.put(this.baseUrl + 'api/menu/' + id, updateMenuItem);
  }

  delete(id) {
    return this.http.delete(this.baseUrl + 'api/menu/' + id);
  }
}
