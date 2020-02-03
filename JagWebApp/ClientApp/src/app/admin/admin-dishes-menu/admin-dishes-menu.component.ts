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
    filteredMenuItems: Array<MenuItem> = [];
    currentSelectedCategoryId = 0;

    constructor(
        private menuService: MenuService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.spinner.show();
        
        this.menuService.getMenuItems()
            .subscribe((result: Array<MenuItem>) => {
                this.menuItems = result;
                this.sortArrayByDishName(this.menuItems);
                this.filteredMenuItems = this.menuItems;
                this.spinner.hide();
            });
    }

    addMenuItem(item: MenuItem) {
        this.menuItems.push(item);
        this.sortArrayByDishName(this.menuItems);

        if (item.dish.category.id === this.currentSelectedCategoryId) {
            this.filteredMenuItems.push(item);
            this.sortArrayByDishName(this.filteredMenuItems);
        }
    }

    removeItemFromMenu(item: MenuItem) {
        this.removeItem(this.menuItems, item.id);
        if (item.dish.category.id === this.currentSelectedCategoryId) {
            this.removeItem(this.filteredMenuItems, item.id);
        }
    }

    updateItemLimit(data) {
        let index = this.menuItems.findIndex(i => i.id === data.id);
        this.menuItems[index].available = data.limit;
    }

    toggle(value) {
        this.currentSelectedCategoryId = value;
        if (value === 0)
            this.filteredMenuItems = this.menuItems;
        else
            this.filteredMenuItems = this.menuItems.filter(item => item.dish.category.id === value);
    }

    private sortArrayByDishName(array) {
        array.sort((a, b) => a.dish.name.localeCompare(b.dish.name));
    }

    private removeItem(array: Array<any>, itemId) {
        let index = array.findIndex(i => i.id === itemId);
        array.splice(index, 1);
    }
}
