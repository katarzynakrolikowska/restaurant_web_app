import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OrdinaryMenuItem } from '../../models/ordinary-menu-item';
import { MainMenuItem } from '../../models/main-menu-item';
import { Router } from '@angular/router';
import { Dish } from '../../models/dish';
import { CATEGORY_ALL_MENU_ITEMS_ID, CATEGORY_MAIN_MENU_ITEM_ID } from '../../consts/app-consts';


@Component({
    selector: 'app-admin-dishes-menu',
    templateUrl: './admin-dishes-menu.component.html',
    styleUrls: ['./admin-dishes-menu.component.css']
})
export class AdminDishesMenuComponent implements OnInit {
    categoryAll = CATEGORY_ALL_MENU_ITEMS_ID;
    categoryMainItem = CATEGORY_MAIN_MENU_ITEM_ID;

    ordinaryMenuItems: Array<OrdinaryMenuItem> = [];
    mainMenuItem: MainMenuItem;
    filteredMenuItems: Array<OrdinaryMenuItem> = [];
    
    currentSelectedCategoryId = CATEGORY_ALL_MENU_ITEMS_ID;
    

    constructor(
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.spinner.show();
        
        this.menuService.getMenuItems()
            .subscribe((result: Array<MainMenuItem>) => {
                result.forEach(item => {
                    !item.isMain ? this.ordinaryMenuItems.push(this.getOrdinaryMenuItem(item)) : 
                        this.mainMenuItem = item;
                });

                if (this.mainMenuItem) 
                    this.sortDishesByCategoryId(this.mainMenuItem.dishes);

                this.sortOrdinaryMenuItemsByCategoryId(this.ordinaryMenuItems);
                this.filteredMenuItems = this.ordinaryMenuItems;
                this.spinner.hide();
            });
    }

    addDishToMenu() {
        this.router.navigate(['admin/menu/'  + 'item' + '/new']);
    }

    removeItemFromMenu(item: OrdinaryMenuItem) {
        this.removeItemFromArray(this.ordinaryMenuItems, item.id);
        if (item.dish.category.id === this.currentSelectedCategoryId) {
            this.removeItemFromArray(this.filteredMenuItems, item.id);
        }
    }

    updateItem(data) {
        let index = this.ordinaryMenuItems.findIndex(i => i.id === data.id);
        this.ordinaryMenuItems[index].price = data.item.price;
        this.ordinaryMenuItems[index].available = data.item.available;
    }

    toggleCategory(categoryId) {
        this.currentSelectedCategoryId = categoryId;

        categoryId === CATEGORY_ALL_MENU_ITEMS_ID ? this.filteredMenuItems = this.ordinaryMenuItems :
            this.filteredMenuItems = this.ordinaryMenuItems.filter(item => item.dish.category.id === categoryId);
    }

    removeMainItem() {
        this.mainMenuItem = null;
    }

    private sortDishesByCategoryId(array: Array<Dish>) {
        array.sort((a, b) => a.category.id - b.category.id);
    }

    private sortOrdinaryMenuItemsByCategoryId(array: Array<OrdinaryMenuItem>) {
        array.sort((a, b) => a.dish.category.id - b.dish.category.id);
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
