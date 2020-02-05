import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrdinaryMenuItem } from '../../models/ordinary-menu-item';
import { MainMenuItem } from '../../models/main-menu-item';
import { UpdateMenuItem } from '../../models/update-menu-item';
import { Dish } from '../../models/dish';


@Component({
    selector: 'app-admin-dishes-menu',
    templateUrl: './admin-dishes-menu.component.html',
    styleUrls: ['./admin-dishes-menu.component.css']
})
export class AdminDishesMenuComponent implements OnInit {
    ordinaryMenuItems: Array<OrdinaryMenuItem> = [];
    mainMenuItem: MainMenuItem;
    dishes: Array<Dish>;
    filteredMenuItems: Array<OrdinaryMenuItem> = [];
    currentSelectedCategoryId = 0;

    constructor(
        private menuService: MenuService,
        private spinner: NgxSpinnerService) { }

    ngOnInit() {
        this.spinner.show();
        
        this.menuService.getMenuItems()
            .subscribe((result: Array<MainMenuItem>) => {
                result.forEach(item => {
                    if (item.dishes.length === 1) {
                        let ordinaryItem: OrdinaryMenuItem = this.getOrdinaryMenuItem(item);

                        this.ordinaryMenuItems.push(ordinaryItem);
                    } else {
                        this.mainMenuItem = item;
                        this.dishes = item.dishes;
                        console.log(this.mainMenuItem)
                    }
                    
                });
                this.sortArrayByDishName(this.ordinaryMenuItems);
                this.filteredMenuItems = this.ordinaryMenuItems;
                this.spinner.hide();
            });
    }

    addMenuItem(mainMenuItem: MainMenuItem) {
        let item = this.getOrdinaryMenuItem(mainMenuItem);
        this.ordinaryMenuItems.push(item);
        this.sortArrayByDishName(this.ordinaryMenuItems);

        if (item.dish.category.id === this.currentSelectedCategoryId) {
            this.filteredMenuItems.push(item);
            this.sortArrayByDishName(this.filteredMenuItems);
        }
    }

    removeItemFromMenu(item: OrdinaryMenuItem) {
        this.removeItemFromArray(this.ordinaryMenuItems, item.id);
        if (item.dish.category.id === this.currentSelectedCategoryId) {
            this.removeItemFromArray(this.filteredMenuItems, item.id);
        }
    }

    updateItem(updateMenuItem: UpdateMenuItem) {
        let index = this.ordinaryMenuItems.findIndex(i => i.id === updateMenuItem.id);
        this.ordinaryMenuItems[index].price = updateMenuItem.data.price;
        this.ordinaryMenuItems[index].available = updateMenuItem.data.available;
    }

    toggleCategory(categoryId) {
        this.currentSelectedCategoryId = categoryId;
        if (categoryId === 0)
            this.filteredMenuItems = this.ordinaryMenuItems;
        else
            this.filteredMenuItems = this.ordinaryMenuItems.filter(item => item.dish.category.id === categoryId);
    }

    private sortArrayByDishName(array) {
        array.sort((a, b) => a.dish.name.localeCompare(b.dish.name));
    }

    private removeItemFromArray(array: Array<any>, itemId) {
        let index = array.findIndex(i => i.id === itemId);
        array.splice(index, 1);
    }

    private getOrdinaryMenuItem(item: MainMenuItem) {
        let ordinaryMenuItem: OrdinaryMenuItem = {
            id: item.id,
            dish: item.dishes[0],
            price: item.price,
            limit: item.limit,
            available: item.available,
        }
        return ordinaryMenuItem;
    }
}
