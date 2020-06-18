import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { OrderDetailsViewComponent } from 'shared/components/order-details-view/order-details-view.component';
import { AuthGuard } from 'shared/guards/auth.guard';
import { SharedModule } from './../shared/shared.module';
import { AdminCategoryFormDialogComponent } from './components/admin-category-form-dialog/admin-category-form-dialog.component';
import { AdminDishCategoriesViewComponent } from './components/admin-dish-categories-view/admin-dish-categories-view.component';
import { AdminDishFormComponent } from './components/admin-dish-form/admin-dish-form.component';
import { AdminDishTabsComponent } from './components/admin-dish-tabs/admin-dish-tabs.component';
import { AdminDishesViewComponent } from './components/admin-dishes-view/admin-dishes-view.component';
import { AdminMainItemEditFormComponent } from './components/admin-main-item-edit-form/admin-main-item-edit-form.component';
import { AdminMenuFormComponent } from './components/admin-menu-form/admin-menu-form.component';
import { AdminOrdersViewComponent } from './components/admin-orders-view/admin-orders-view.component';
import { AdminOrdinaryItemEditDialogComponent } from './components/admin-ordinary-item-edit-dialog/admin-ordinary-item-edit-dialog.component';
import { AdminPhotosViewComponent } from './components/admin-photos-view/admin-photos-view.component';
import { DishesListComponent } from './components/dishes-list/dishes-list.component';
import { AdminGuard } from './guards/admin.guard';



@NgModule({
  imports: [
    MaterialFileInputModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: 'admin',
        runGuardsAndResolvers: 'always',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'dishes/new',
            component: AdminDishFormComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'dishes/edit/:id',
            component: AdminDishTabsComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'dishes',
            component: AdminDishesViewComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'menu/:item/edit/:id',
            component: AdminMainItemEditFormComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'menu/:item/new',
            component: AdminMenuFormComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'orders',
            component: AdminOrdersViewComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'orders/:id',
            component: OrderDetailsViewComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'categories',
            component: AdminDishCategoriesViewComponent,
            canActivate: [AdminGuard]
          }
        ]
      }
    ])
  ],
  declarations: [
    AdminCategoryFormDialogComponent,
    AdminDishCategoriesViewComponent,
    AdminDishFormComponent,
    AdminDishTabsComponent,
    AdminDishesViewComponent,
    AdminMainItemEditFormComponent,
    AdminMenuFormComponent,
    AdminOrdersViewComponent,
    AdminOrdersViewComponent,
    AdminOrdinaryItemEditDialogComponent,
    AdminPhotosViewComponent,
    DishesListComponent
  ],
  exports: [
    AdminCategoryFormDialogComponent,
    AdminOrdinaryItemEditDialogComponent
  ],
  entryComponents: [
    AdminCategoryFormDialogComponent,
    AdminOrdinaryItemEditDialogComponent
  ]
})
export class AdminModule { }
