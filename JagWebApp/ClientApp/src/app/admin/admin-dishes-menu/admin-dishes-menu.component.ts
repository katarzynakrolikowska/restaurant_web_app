import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menuItem';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-admin-dishes-menu',
    templateUrl: './admin-dishes-menu.component.html',
    styleUrls: ['./admin-dishes-menu.component.css']
})
export class AdminDishesMenuComponent implements OnInit {
    menuItems: Array<MenuItem> = [];

    constructor(private menuService: MenuService, private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.spinner.show();
        this.menuService.getMenuItems()
            .subscribe((result: Array<MenuItem>) => {
                this.menuItems = result;
                this.spinner.hide();
            });
    }

    removeItemFromMenu(itemId) {
        let index = this.menuItems.findIndex(i => i.id === itemId);
        this.menuItems.splice(index, 1);
    }

    updateItemLimit(data) {
        let index = this.menuItems.findIndex(i => i.id === data.id);
        this.menuItems[index].available = data.limit;
    }
}
