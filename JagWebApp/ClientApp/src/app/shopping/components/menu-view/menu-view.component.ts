import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ALL_MENU_ITEMS_CATEGORY_ID, MAIN_MENU_ITEM_CATEGORY_ID } from 'shared/consts/app.consts';
import { Dish } from 'shared/models/dish';
import { MenuItem } from 'shared/models/menu-item';
import { MenuService } from 'shared/services/menu.service';
import { SignalRService } from 'shared/services/signal-r.service';
import { OrdinaryMenuItem } from 'src/app/shopping/models/ordinary-menu-item';


@Component({
  selector: 'app-menu-view',
  templateUrl: './menu-view.component.html',
  styleUrls: []
})
export class MenuViewComponent implements OnInit, OnDestroy {
  categoryAll = ALL_MENU_ITEMS_CATEGORY_ID ;
  categoryMainItem = MAIN_MENU_ITEM_CATEGORY_ID;
  currentSelectedCategoryId = ALL_MENU_ITEMS_CATEGORY_ID;

  ordinaryMenuItems: OrdinaryMenuItem[] = [];
  mainMenuItem: MenuItem;
  filteredMenuItems: OrdinaryMenuItem[] = [];
  subscription: Subscription;
  
  constructor(
    private menuService: MenuService,
    private spinner: NgxSpinnerService,
    private signalRService: SignalRService) { }

  ngOnInit() {
    this.spinner.show();
    
    this.menuService.getAll()
      .subscribe(menuItems => {
        this.initMenuItems(menuItems);
        this.spinner.hide();
      });

    this.setUpSignalRConnection();
  }

  toggleCategory(categoryId) {
    this.currentSelectedCategoryId = categoryId;

    categoryId === ALL_MENU_ITEMS_CATEGORY_ID ?
      this.filteredMenuItems = this.ordinaryMenuItems :
      this.filteredMenuItems = this.ordinaryMenuItems.filter(item => item.dish.category.id === categoryId);

    document.getElementById('sidenavContent').scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initMenuItems(menuItems: MenuItem[]) {
    menuItems.forEach(item => {
      !item.isMain ? this.ordinaryMenuItems.push(this.getOrdinaryMenuItem(item)) :
        this.mainMenuItem = item;
    });

    if (this.mainMenuItem)
      this.sortDishesByCategoryId(this.mainMenuItem.dishes);

    this.sortOrdinaryMenuItemsByCategoryId(this.ordinaryMenuItems);
    this.filteredMenuItems = this.ordinaryMenuItems;
  }

  private sortDishesByCategoryId(array: Dish[]) {
    array.sort((a, b) => a.category.id - b.category.id);
  }

  private sortOrdinaryMenuItemsByCategoryId(array: OrdinaryMenuItem[]) {
    array.sort((a, b) => a.dish.category.id - b.dish.category.id);
  }

  private setUpSignalRConnection() {
    if (!this.signalRService.isConnected()) {
      this.signalRService.startConnection();
      this.signalRService.addTransferUpdatedItemListener();
      this.signalRService.addTransferDeletedItemListener();
    }

    this.subscription = this.signalRService.onUpdatedItemReceived
      .subscribe((menuItems: MenuItem[]) =>
        menuItems.forEach(mi => mi.isMain ? this.mainMenuItem = mi : this.updateMenuItem(mi)));

    this.subscription.add(this.signalRService.onDeletedItemReceived
      .subscribe((menuItem: MenuItem) => 
        menuItem.isMain ? this.removeMainItem() : this.removeItemFromMenu(this.getOrdinaryMenuItem(menuItem))));
  }

  private updateMenuItem(menuItem: MenuItem) {
    this.updateMenuItemInArray(menuItem, this.ordinaryMenuItems);
    if (menuItem.dishes[0].category.id === this.currentSelectedCategoryId) 
      this.updateMenuItemInArray(menuItem, this.filteredMenuItems);
  }

  private updateMenuItemInArray(menuItem: MenuItem, array: OrdinaryMenuItem[]) {
    const index = array.findIndex(item => item.id === menuItem.id);
    array[index].available = menuItem.available;
    array[index].price = menuItem.price;
  }

  private removeMainItem() {
    this.mainMenuItem = null;
  }

  private removeItemFromMenu(item: OrdinaryMenuItem) {
    this.removeItemFromArray(this.ordinaryMenuItems, item.id);
    if (item.dish.category.id === this.currentSelectedCategoryId) 
      this.removeItemFromArray(this.filteredMenuItems, item.id);
  }

  private removeItemFromArray(array: any[], itemId) {
    const index = array.findIndex(i => i.id === itemId);
    if (index >= 0)
      array.splice(index, 1);
  }
  
  private getOrdinaryMenuItem = (item: MenuItem) => {
    return {
      id: item.id,
      dish: item.dishes[0],
      price: item.price,
      available: item.available,
      ordered: item.ordered
    }
   }
}
