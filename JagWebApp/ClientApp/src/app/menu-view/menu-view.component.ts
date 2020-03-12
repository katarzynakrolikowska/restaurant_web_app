import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ALL_MENU_ITEMS_CATEGORY_ID, MAIN_MENU_ITEM_CATEGORY_ID  } from '../consts/app.consts';
import { OrdinaryMenuItem } from '../models/ordinary-menu-item';
import { MenuItem } from '../models/menu-item';
import { MenuService } from '../services/menu.service';
import { Dish } from '../models/dish';
import { SignalRService } from '../services/signal-r.service';


@Component({
    selector: 'app-menu-view',
    templateUrl: './menu-view.component.html',
    styleUrls: ['./menu-view.component.css']
})
export class MenuViewComponent implements OnInit {
    categoryAll = ALL_MENU_ITEMS_CATEGORY_ID ;
    categoryMainItem = MAIN_MENU_ITEM_CATEGORY_ID ;

    ordinaryMenuItems: Array<OrdinaryMenuItem> = [];
    mainMenuItem: MenuItem;
    filteredMenuItems: Array<OrdinaryMenuItem> = [];
    
    currentSelectedCategoryId = ALL_MENU_ITEMS_CATEGORY_ID ;
    

    constructor(
        private menuService: MenuService,
        private spinner: NgxSpinnerService,
        private signalRService: SignalRService) { }

    ngOnInit() {
        this.spinner.show();
        
        this.menuService.getMenuItems()
            .subscribe((menuItems: Array<MenuItem>) => {
                this.initMenuItems(menuItems);
                this.spinner.hide();
            });

        this.signalRService.startConnection();

        this.signalRService.addTransferUpdatedItemListener();
        this.signalRService.onUpdatedItemReceived
            .subscribe((menuItem: MenuItem) =>
                menuItem.isMain ? this.mainMenuItem = menuItem : this.updateMenuItem(menuItem));

        this.signalRService.addTransferDeletedItemListener();
        this.signalRService.onDeletedItemReceived
            .subscribe((menuItem: MenuItem) => {
                menuItem.isMain ?
                    this.removeMainItem() :
                    this.removeItemFromMenu(this.getOrdinaryMenuItem(menuItem));
            });
    }

    toggleCategory(categoryId) {
        this.currentSelectedCategoryId = categoryId;

        categoryId === ALL_MENU_ITEMS_CATEGORY_ID ?
            this.filteredMenuItems = this.ordinaryMenuItems :
            this.filteredMenuItems = this.ordinaryMenuItems.filter(item =>
                item.dish.category.id === categoryId);

        document.getElementById('sidenavContent').scrollTo(0, 0);
    }

    private removeMainItem() {
        this.mainMenuItem = null;
    }

    private removeItemFromMenu(item: OrdinaryMenuItem) {
        this.removeItemFromArray(this.ordinaryMenuItems, item.id);
        if (item.dish.category.id === this.currentSelectedCategoryId) {
            this.removeItemFromArray(this.filteredMenuItems, item.id);
        }
    }

    private initMenuItems(menuItems: Array<MenuItem>) {
        menuItems.forEach(item => {
            !item.isMain ? this.ordinaryMenuItems.push(this.getOrdinaryMenuItem(item)) :
                this.mainMenuItem = item;
        });

        if (this.mainMenuItem)
            this.sortDishesByCategoryId(this.mainMenuItem.dishes);

        this.sortOrdinaryMenuItemsByCategoryId(this.ordinaryMenuItems);
        this.filteredMenuItems = this.ordinaryMenuItems;
    }


    private sortDishesByCategoryId(array: Array<Dish>) {
        array.sort((a, b) => a.category.id - b.category.id);
    }

    private sortOrdinaryMenuItemsByCategoryId(array: Array<OrdinaryMenuItem>) {
        array.sort((a, b) => a.dish.category.id - b.dish.category.id);
    }

    private updateMenuItem(menuItem: MenuItem) {
        this.updateMenuItemInArray(menuItem, this.ordinaryMenuItems);

        if (menuItem.dishes[0].category.id === this.currentSelectedCategoryId) {
            this.updateMenuItemInArray(menuItem, this.filteredMenuItems);
        }
    }

    private updateMenuItemInArray(menuItem: MenuItem, array: Array<OrdinaryMenuItem>) {
        let index = array.findIndex(item => item.id === menuItem.id);
        array[index].available = menuItem.available;
        array[index].price = menuItem.price;
    }

    private removeItemFromArray(array: Array<any>, itemId) {
        let index = array.findIndex(i => i.id === itemId);
        array.splice(index, 1);
    }

    private getOrdinaryMenuItem(item: MenuItem) {
        let ordinaryMenuItem: OrdinaryMenuItem = {
            id: item.id,
            dish: item.dishes[0],
            price: item.price,
            available: item.available,
        }
        return ordinaryMenuItem;
    }
}
