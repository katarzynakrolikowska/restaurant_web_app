import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material';
import { of } from 'rxjs';
import { OrderService } from 'shared/services/order.service';
import { orderStub } from 'shared/test/stubs/order.stub';
import { UserOrdersViewComponent } from './user-orders-view.component';


describe('UserOrdersViewComponent', () => {
  const baseURL = '';
  let component: UserOrdersViewComponent;
  let fixture: ComponentFixture<UserOrdersViewComponent>;
  let orderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOrdersViewComponent ],
      imports: [
        HttpClientModule,
        MatTableModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrdersViewComponent);
    component = fixture.componentInstance;
    orderService = TestBed.get(OrderService);
    spyOn(orderService, 'getUserOrders').and.returnValue(of([orderStub]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init orders', () => {
    expect(component.orders.length).toEqual(1);
  });
});
