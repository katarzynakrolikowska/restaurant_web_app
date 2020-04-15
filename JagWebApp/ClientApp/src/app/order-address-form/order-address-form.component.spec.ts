import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { customerStub } from 'src/test/stubs/customer.stub';
import { UserService } from './../services/user.service';
import { OrderAddressFormComponent } from './order-address-form.component';


export const activatedRouteStub2 = {
  snapshot: {
      routeConfig: {
          path: 'user/data/address/edit'
      }
  }
};

describe('OrderAddressFormComponent', () => {
  const baseURL = '';
  let component: OrderAddressFormComponent;
  let fixture: ComponentFixture<OrderAddressFormComponent>;
  let userService;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAddressFormComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL },
        { provide: ActivatedRoute, useValue: activatedRouteStub2 }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAddressFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    router = TestBed.get(Router);
    spyOn(userService, 'getUser').and.returnValue(of(customerStub));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT call update() from userService when save() is called and for is invalid', () => {
    component.customerName.setValue('');
    let spyUserService = spyOn(userService, 'update').and.returnValue(of(Object));
    component.save();

    expect(spyUserService).not.toHaveBeenCalled();
  });

  it('should call update() from userService when save() is called and form is valid', () => {
    setValidFormValues();
    let spyUserService = spyOn(userService, 'update').and.returnValue(of(Object));
    let spyRouter = spyOn(router, 'navigate');
    component.save();

    expect(spyUserService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/user/data']);
  });

  function setValidFormValues() {
    component.customerName.setValue('a');
    component.phone.setValue('111999111');
    component.street.setValue('a');
    component.houseNumber.setValue('a');
    component.postcode.setValue('11-111');
    component.city.setValue('a');
  }
});
