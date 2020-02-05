import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UpdateMenuItem } from '../models/update-menu-item';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getMenuItems() {
        return this.http.get(this.baseUrl + 'api/menu')
            .pipe(map(response => response));
    }

    create(menuItem) {
        return this.http.post(this.baseUrl + 'api/menu', menuItem)
            .pipe(map(response => response));
    }

    updateItem(updateMenuItem: UpdateMenuItem) {
        return this.http.post(this.baseUrl + 'api/menu/' + updateMenuItem.id, updateMenuItem.data)
            .pipe(map(response => response));
    }

    deleteItem(id) {
        return this.http.delete(this.baseUrl + 'api/menu/' + id)
            .pipe(map(response => response));
    }
}
