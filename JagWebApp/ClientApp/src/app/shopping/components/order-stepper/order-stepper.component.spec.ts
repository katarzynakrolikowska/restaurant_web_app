import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { OrderService } from 'shared/services/order.service';
import { UserService } from 'shared/services/user.service';
import { BlankComponent } from 'shared/test/blank/blank.component';
import { cartStubWithOneMenuItem } from 'shared/test/stubs/cart.stub';
import { customerStub } from 'shared/test/stubs/customer.stub';
import { orderStub } from 'shared/test/stubs/order.stub';
import { OrderStepperComponent } from './order-stepper.component';


describe('OrderStepperComponent', () => {
  const baseURL = '';
  let component: OrderStepperComponent;
  let fixture: ComponentFixture<OrderStepperComponent>;
  let userService;
  let cartItemSharedService;
  let router;
  let orderService;
  let dialog;
  let toastr;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderStepperComponent, BlankComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([
          { path: 'menu', component: BlankComponent}
        ]),
        MatDialogModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderStepperComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    cartItemSharedService = TestBed.get(CartItemsSharedService);
    router = TestBed.get(Router);
    orderService = TestBed.get(OrderService);
    dialog = TestBed.get(MatDialog);
    toastr = TestBed.get(ToastrService);
  });

  it('should create', () => {
    spyOn(userService, 'getSingle').and.returnValue(of(customerStub));
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should navigate to menu if cart is empty', () => {
    spyOn(userService, 'getSingle').and.returnValue(of(customerStub));
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(undefined));
    let spy = spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(['/menu']);
  });

  it('should NOT create order when orderMenu() is called and form is invalid', () => {
    spyOn(userService, 'getSingle').and.returnValue(of(undefined));
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));
    let spy = spyOn(orderService, 'create').and.returnValue(of(orderStub));

    fixture.detectChanges();
    component.orderMenu();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should create order when orderMenu() is called and form is valid', () => {
    spyOn(userService, 'getSingle').and.returnValue(of(customerStub));
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));
    let spy = spyOn(orderService, 'create').and.returnValue(of(orderStub));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(Object) });

    fixture.detectChanges();
    component.orderMenu();

    expect(spy).toHaveBeenCalled();
  });

  it('should NOT create order when orderMenu() is called and create() from service returns error', () => {
    const errorResponse = { status: 404 };
    spyOn(userService, 'getSingle').and.returnValue(of(customerStub));
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));
    spyOn(orderService, 'create').and.callFake(() => throwError(errorResponse));
    let spy = spyOn(toastr, 'error');
    fixture.detectChanges();
    component.orderMenu();

    expect(spy).toHaveBeenCalled();
  });
});
