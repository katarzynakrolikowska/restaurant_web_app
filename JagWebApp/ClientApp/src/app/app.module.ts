import { TOKEN } from './shared/consts/app.consts';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { AdminModule } from './admin/admin.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MembershipModule } from './membership/membership.module';
import { SharedModule } from './shared/shared.module';
import { ShoppingModule } from './shopping/shopping.module';

export function tokenGetter() {
  return localStorage.getItem(TOKEN);
}

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    AdminModule,
    CoreModule,
    MembershipModule,
    SharedModule,
    ShoppingModule,
    RouterModule.forRoot([
      { 
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full' 
      },
      { 
        path: '**', 
        redirectTo: 'home', 
        pathMatch: 'full' 
      }
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["localhost:44363"],
        blacklistedRoutes: ["localhost:44363/api/auth"]
        // whitelistedDomains: ["jag-restaurant.pl"],
        // blacklistedRoutes: ["jag-restaurant.pl/api/auth"]
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
