import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { BlankComponent } from 'src/test/blank/blank.component';
import { AdminDishFormComponent } from './admin/admin-dish-form/admin-dish-form.component';
import { AdminDishTabsComponent } from './admin/admin-dish-tabs/admin-dish-tabs.component';
import { AdminDishesViewComponent } from './admin/admin-dishes-view/admin-dishes-view.component';
import { AdminMainItemEditFormComponent } from './admin/admin-main-item-edit-form/admin-main-item-edit-form.component';
import { AdminMenuFormComponent } from './admin/admin-menu-form/admin-menu-form.component';
import { AdminOrdersViewComponent } from './admin/admin-orders-view/admin-orders-view.component';
import { AdminOrdinaryItemEditDialogComponent } from './admin/admin-ordinary-item-edit-dialog/admin-ordinary-item-edit-dialog.component';
import { AdminPhotosViewComponent } from './admin/admin-photos-view/admin-photos-view.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppErrorHandler } from './app.error-handler';
import { CartActionButtonsComponent } from './cart-action-buttons/cart-action-buttons.component';
import { CartViewComponent } from './cart-view/cart-view.component';
import { CategoriesButtonToggleGroupComponent } from './categories-button-toggle-group/categories-button-toggle-group.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { DialogOrderAcceptedComponent } from './dialog-order-accepted/dialog-order-accepted.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { EditEmailFormComponent } from './edit-email-form/edit-email-form.component';
import { EditPasswordFormComponent } from './edit-password-form/edit-password-form.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { NotAdminGuard } from './guards/not-admin.guard';
import { CustomMatPaginatorIntl } from './helpers/custom-mat-paginator-intl';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginPanelComponent } from './login-panel/login-panel.component';
import { MainMenuItemDishCardComponent } from './main-menu-item-dish-card/main-menu-item-dish-card.component';
import { MainMenuItemViewComponent } from './main-menu-item-view/main-menu-item-view.component';
import { MatComponentsModule } from './mat-component.module';
import { MenuViewComponent } from './menu-view/menu-view.component';
import { NavCartButtonComponent } from './nav-cart-button/nav-cart-button.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { OrderAddressAddViewComponent } from './order-address-add-view/order-address-add-view.component';
import { OrderAddressFormComponent } from './order-address-form/order-address-form.component';
import { OrderDetailsViewComponent } from './order-details-view/order-details-view.component';
import { OrderStepperComponent } from './order-stepper/order-stepper.component';
import { OrdinaryMenuItemCardComponent } from './ordinary-menu-item-card/ordinary-menu-item-card.component';
import { OrdinaryMenuItemsViewComponent } from './ordinary-menu-items-view/ordinary-menu-items-view.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ToolbarIconButtonsComponent } from './toolbar-icon-buttons/toolbar-icon-buttons.component';
import { UserDataTabsComponent } from './user-data-tabs/user-data-tabs.component';
import { UserOrdersViewComponent } from './user-orders-view/user-orders-view.component';
import { HomeComponent } from './home/home.component';
import { AdminDishCategoriesViewComponent } from './admin/admin-dish-categories-view/admin-dish-categories-view.component';
import { AdminCategoryFormDialogComponent } from './admin/admin-category-form-dialog/admin-category-form-dialog.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    RegisterFormComponent,
    LoginFormComponent,
    LoginPanelComponent,
    UserDataTabsComponent,
    EditEmailFormComponent,
    EditPasswordFormComponent,
    SpinnerComponent,
    NotFoundComponent,
    AdminDishesViewComponent,
    AdminDishFormComponent,
    DialogConfirmComponent,
    AdminDishTabsComponent,
    AdminPhotosViewComponent,
    MenuViewComponent,
    AdminMenuFormComponent,
    OrdinaryMenuItemCardComponent,
    AdminOrdinaryItemEditDialogComponent,
    CategoriesButtonToggleGroupComponent,
    MainMenuItemDishCardComponent,
    MainMenuItemViewComponent,
    BlankComponent,
    DishesListComponent,
    AdminMainItemEditFormComponent,
    ToolbarIconButtonsComponent,
    OrdinaryMenuItemsViewComponent,
    CartActionButtonsComponent,
    NavCartButtonComponent,
    CartViewComponent,
    OrderAddressFormComponent,
    OrderAddressAddViewComponent,
    OrderStepperComponent,
    DialogOrderAcceptedComponent,
    AdminOrdersViewComponent,
    UserOrdersViewComponent,
    OrderDetailsViewComponent,
    HomeComponent,
    AdminDishCategoriesViewComponent,
    AdminCategoryFormDialogComponent,

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'admin/dishes/new',
            component: AdminDishFormComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/dishes/edit/:id',
            component: AdminDishTabsComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/dishes',
            component: AdminDishesViewComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/menu/:item/edit/:id',
            component: AdminMainItemEditFormComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/menu/:item/new',
            component: AdminMenuFormComponent,
            data: { roles: ['Admin'] },
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/orders/:id',
            component: OrderDetailsViewComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/orders',
            component: AdminOrdersViewComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'admin/categories',
            component: AdminDishCategoriesViewComponent,
            canActivate: [AdminGuard]
          },
          {
            path: 'user/data/address/new',
            component: OrderAddressFormComponent,
            canActivate: [NotAdminGuard]
          },
          {
            path: 'user/data',
            component: UserDataTabsComponent
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
          }]
      },
      {
        path: 'cart',
        component: CartViewComponent,
        canActivate: [NotAdminGuard]
      },
      { path: 'menu', component: MenuViewComponent },
      { path: 'cart', component: CartViewComponent },
      { path: 'login', component: LoginPanelComponent },
      { path: '**', component: NotFoundComponent }
    ]),
    BrowserAnimationsModule,
    MatComponentsModule,
    MaterialFileInputModule,
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      config: {
      tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:44363"],
        blacklistedRoutes: ["localhost:44363/api/auth"]
      }
    }),
    NgxSpinnerModule

    ],
    entryComponents: [
      DialogConfirmComponent, 
      AdminOrdinaryItemEditDialogComponent, 
      DialogOrderAcceptedComponent,
      AdminCategoryFormDialogComponent
    ],
    providers: [
      { provide: ErrorHandler, useClass: AppErrorHandler },
      { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
