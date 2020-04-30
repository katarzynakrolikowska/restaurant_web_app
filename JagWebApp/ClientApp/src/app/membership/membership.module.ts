import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from 'shared/guards/auth.guard';
import { NotAdminGuard } from 'shared/guards/not-admin.guard';
import { SharedModule } from './../shared/shared.module';
import { AddressAddViewComponent } from './components/address-add-view/address-add-view.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { EditEmailFormComponent } from './components/edit-email-form/edit-email-form.component';
import { EditPasswordFormComponent } from './components/edit-password-form/edit-password-form.component';
import { UserDataTabsComponent } from './components/user-data-tabs/user-data-tabs.component';



@NgModule({
  declarations: [
    EditEmailFormComponent,
    EditPasswordFormComponent,
    AddressAddViewComponent,
    AddressFormComponent,
    UserDataTabsComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivateChild: [AuthGuard],
        children: [
          {
            path: 'user/data/address/new',
            component: AddressFormComponent,
            canActivate: [NotAdminGuard]
          },
          {
            path: 'user/data',
            component: UserDataTabsComponent
          },
        ]
      }
    ])
  ]
})
export class MembershipModule { }
