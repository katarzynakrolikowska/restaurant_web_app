import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { RegisterFormComponent } from './register-form/register-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AppErrorHandler } from './app.error-handler';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LoginPanelComponent } from './login-panel/login-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { AppRoutingModule } from './app-routing.module';
import { AdminGuard } from './guards/admin.guard';
import { MatComponentsModule } from './mat-component.module';
import { UserDataTabsComponent } from './user-data-tabs/user-data-tabs.component';
import { EditEmailFormComponent } from './edit-email-form/edit-email-form.component';
import { EditPasswordFormComponent } from './edit-password-form/edit-password-form.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerComponent } from './spinner/spinner.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NotFoundComponent } from './not-found/not-found.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { CustomMatPaginatorIntl } from './helpers/custom-mat-paginator-intl';
import { MatPaginatorIntl } from '@angular/material';
import { AdminMenuFormComponent } from './admin/admin-menu-form/admin-menu-form.component';
import { CategoriesButtonToggleGroupComponent } from './categories-button-toggle-group/categories-button-toggle-group.component';
import { MainMenuItemViewComponent } from './main-menu-item-view/main-menu-item-view.component';
import { BlankComponent } from './test/blank/blank.component';
import { DishesListComponent } from './dishes-list/dishes-list.component';
import { AdminMainItemEditFormComponent } from './admin/admin-main-item-edit-form/admin-main-item-edit-form.component';
import { MenuButtonsComponent } from './menu-buttons/menu-buttons.component';
import { MenuViewComponent } from './menu-view/menu-view.component';
import { AdminOrdinaryItemEditDialogComponent } from './admin/admin-ordinary-item-edit-dialog/admin-ordinary-item-edit-dialog.component';
import { DialogConfirmComponent } from './dialog-confirm/dialog-confirm.component';
import { OrdinaryMenuItemCardComponent } from './ordinary-menu-item-card/ordinary-menu-item-card.component';
import { AdminDishesViewComponent } from './admin/admin-dishes-view/admin-dishes-view.component';
import { AdminDishFormComponent } from './admin/admin-dish-form/admin-dish-form.component';
import { AdminDishTabsComponent } from './admin/admin-dish-tabs/admin-dish-tabs.component';
import { AdminPhotosViewComponent } from './admin/admin-photos-view/admin-photos-view.component';
import { MainMenuItemDishCardComponent } from './main-menu-item-dish-card/main-menu-item-dish-card.component';
import { OrdinaryMenuItemsViewComponent } from './ordinary-menu-items-view/ordinary-menu-items-view.component';

export function tokenGetter() {
    return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
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
    MenuButtonsComponent,
    OrdinaryMenuItemsViewComponent,

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
                  path: 'menu',
                  component: MenuViewComponent,
                  
              },
              {
                  path: 'user/data',
                  component: UserDataTabsComponent
              }
          ]
      },
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
    entryComponents: [DialogConfirmComponent, AdminOrdinaryItemEditDialogComponent],
    providers: [
        { provide: ErrorHandler, useClass: AppErrorHandler },
        { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }

    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
