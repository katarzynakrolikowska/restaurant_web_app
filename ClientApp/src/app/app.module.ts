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
import { FetchDataComponent } from './fetch-data/fetch-data.component';
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


export function tokenGetter() {
    return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    RegisterFormComponent,
    LoginFormComponent,
    LoginPanelComponent,
    UserDataTabsComponent,
    EditEmailFormComponent,

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
                  path: 'fetch-data',
                  component: FetchDataComponent,
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
    ]),
    BrowserAnimationsModule,
    MatComponentsModule,
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
            whitelistedDomains: ["localhost:44363"],    
            blacklistedRoutes: ["localhost:44363/api/auth"]
      }
    })

  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
