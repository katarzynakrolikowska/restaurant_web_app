import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderDetailsViewComponent } from 'shared/components/order-details-view/order-details-view.component';
import { NotAdminGuard } from 'shared/guards/not-admin.guard';
import { SharedModule } from './../shared/shared.module';
import { CartActionButtonsComponent } from './components/cart-action-buttons/cart-action-buttons.component';
import { CartViewComponent } from './components/cart-view/cart-view.component';
import { CategoriesButtonToggleGroupComponent } from './components/categories-button-toggle-group/categories-button-toggle-group.component';
import { DialogOrderAcceptedComponent } from './components/dialog-order-accepted/dialog-order-accepted.component';
import { MainMenuItemDishCardComponent } from './components/main-menu-item-dish-card/main-menu-item-dish-card.component';
import { MainMenuItemViewComponent } from './components/main-menu-item-view/main-menu-item-view.component';
import { MenuViewComponent } from './components/menu-view/menu-view.component';
import { OrderStepperComponent } from './components/order-stepper/order-stepper.component';
import { OrdinaryMenuItemCardComponent } from './components/ordinary-menu-item-card/ordinary-menu-item-card.component';
import { OrdinaryMenuItemsViewComponent } from './components/ordinary-menu-items-view/ordinary-menu-items-view.component';
import { ToolbarIconButtonsComponent } from './components/toolbar-icon-buttons/toolbar-icon-buttons.component';
import { UserOrdersViewComponent } from './components/user-orders-view/user-orders-view.component';



@NgModule({
  declarations: [
    CartActionButtonsComponent,
    CartViewComponent,
    CategoriesButtonToggleGroupComponent,
    DialogOrderAcceptedComponent,
    MainMenuItemDishCardComponent,
    MainMenuItemViewComponent,
    MenuViewComponent,
    OrderStepperComponent,
    OrdinaryMenuItemCardComponent,
    OrdinaryMenuItemsViewComponent,
    ToolbarIconButtonsComponent,
    UserOrdersViewComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'cart',
        component: CartViewComponent,
        canActivate: [NotAdminGuard]
      },
      { 
        path: 'menu', 
        component: MenuViewComponent 
      },
      {
        path: 'checkout',
        component: OrderStepperComponent,
        canActivate: [NotAdminGuard]
      },
      {
        path: 'user/orders/:id',
        component: OrderDetailsViewComponent,
        canActivate: [NotAdminGuard]
      },
      {
        path: 'user/orders',
        component: UserOrdersViewComponent,
        canActivate: [NotAdminGuard]
      }
    ])
  ],
  entryComponents: [
    DialogOrderAcceptedComponent
  ],
})
export class ShoppingModule { }
