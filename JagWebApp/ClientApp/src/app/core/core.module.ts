import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NotAuthGuard } from 'shared/guards/not-auth.guard';
import { SharedModule } from './../shared/shared.module';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LoginPanelComponent } from './components/login-panel/login-panel.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { SpinnerComponent } from './components/spinner/spinner.component';



@NgModule({
  declarations: [
    FooterComponent,
    HomeComponent,
    LoginFormComponent,
    LoginPanelComponent,
    NavMenuComponent,
    RegisterFormComponent,
    SpinnerComponent
  ],
  imports: [
    NgxSpinnerModule,
    SharedModule,
    RouterModule.forChild([
      { 
        path: 'home', 
        component: HomeComponent },
      { 
        path: 'login', 
        component: LoginPanelComponent,
        canActivate: [NotAuthGuard]
      }
    ])
  ],
  exports: [
    FooterComponent,
    NavMenuComponent,
    SpinnerComponent
  ]
})
export class CoreModule { }
