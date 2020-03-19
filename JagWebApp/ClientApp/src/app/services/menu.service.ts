import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UpdateMenuItem } from '../models/update-menu-item';
import { MenuItem } from '../models/menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getMenuItems() {
    return this.http.get(this.baseUrl + 'api/menu')
      .pipe(map((response: Array<MenuItem>) => response));
  }

  getMenuItem(itemId) {
    return this.http.get(this.baseUrl + 'api/menu/' + itemId)
      .pipe(map((response: MenuItem) => response));
  }

  create(menuItem) {
    return this.http.post(this.baseUrl + 'api/menu', menuItem);
  }

  updateItem(id, updateMenuItem: UpdateMenuItem) {
    return this.http.put(this.baseUrl + 'api/menu/' + id, updateMenuItem);
  }

  deleteItem(id) {
    return this.http.delete(this.baseUrl + 'api/menu/' + id);
  }
}
