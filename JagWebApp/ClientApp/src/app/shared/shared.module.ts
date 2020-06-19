import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorIntl } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ToastrModule } from 'ngx-toastr';
import { MatComponentsModule } from './../material/mat-component.module';
import { DialogConfirmComponent } from './components/dialog-confirm/dialog-confirm.component';
import { NavCartButtonComponent } from './components/nav-cart-button/nav-cart-button.component';
import { OrderDetailsViewComponent } from './components/order-details-view/order-details-view.component';
import { AppErrorHandler } from './helpers/app.error-handler';
import { CustomMatPaginatorIntl } from './helpers/custom-mat-paginator-intl';
import { BlankComponent } from './test/blank/blank.component';



@NgModule({
  declarations: [
    BlankComponent,
    DialogConfirmComponent,
    NavCartButtonComponent,
    OrderDetailsViewComponent
  ],
  imports: [
    AlertModule.forRoot(),
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    MatComponentsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    RouterModule.forChild([])
  ],
  exports: [
    AlertModule.forRoot().ngModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatComponentsModule,
    DialogConfirmComponent,
    NavCartButtonComponent,
    OrderDetailsViewComponent,
    ReactiveFormsModule,
    ToastrModule.forRoot().ngModule
  ],
  entryComponents: [
    DialogConfirmComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: AppErrorHandler },
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntl }
  ]
})
export class SharedModule { }
