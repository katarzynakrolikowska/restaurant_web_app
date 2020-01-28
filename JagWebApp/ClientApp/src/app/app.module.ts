import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
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
import { DishesComponent } from './admin/dishes/dishes.component';
import { DishFormComponent } from './admin/dish-form/dish-form.component';
import { DialogCofirmComponent } from './dialog-cofirm/dialog-cofirm.component';
import { DishTabsComponent } from './admin/dish-tabs/dish-tabs.component';
import { PhotosViewComponent } from './admin/photos-view/photos-view.component';
import { MaterialFileInputModule } from 'ngx-material-file-input';

export function tokenGetter() {
    return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    RegisterFormComponent,
    LoginFormComponent,
    LoginPanelComponent,
    UserDataTabsComponent,
    EditEmailFormComponent,
    EditPasswordFormComponent,
    SpinnerComponent,
    NotFoundComponent,
    DishesComponent,
    DishFormComponent,
    DialogCofirmComponent,
    DishTabsComponent,
    PhotosViewComponent,

  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      {
          path: '',
          runGuardsAndResolvers: 'always',
          canActivateChild: [AuthGuard],
          children: [
              {
                  path: 'admin/dishes',
                  component: DishesComponent,
                  data: { roles: ['Admin'] },
                  canActivate: [AdminGuard]
              },
              {
                  path: 'admin/dishes/new',
                  component: DishFormComponent,
                  data: { roles: ['Admin'] },
                  canActivate: [AdminGuard]
              },
              {
                  path: 'admin/dishes/edit/:id',
                  component: DishTabsComponent,
                  data: { roles: ['Admin'] },
                  canActivate: [AdminGuard]
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
  entryComponents: [DialogCofirmComponent],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
