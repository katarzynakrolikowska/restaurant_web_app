import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { OrderService } from 'shared/services/order.service';
import { orderStub } from 'shared/test/stubs/order.stub';
import { OrderDetailsViewComponent } from './order-details-view.component';

export const activatedRouteStub = {
  snapshot: {
      params: {
          id: '1'
      }
  }
};

describe('OrderDetailsViewComponent', () => {
  const baseURL = '';
  let component: OrderDetailsViewComponent;
  let fixture: ComponentFixture<OrderDetailsViewComponent>;
  let orderService;
  let router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailsViewComponent ],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailsViewComponent);
    component = fixture.componentInstance;
    orderService = TestBed.get(OrderService);
    router = TestBed.get(Router);
    
  });

  it('should create', () => {
    spyOn(orderService, 'getUserOrder').and.returnValue(of(orderStub));

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should init order', () => {
    spyOn(orderService, 'getUserOrder').and.returnValue(of(orderStub));

    fixture.detectChanges();

    expect(component.order).toBe(orderStub);
  });

  it('should navigate to orders page if getUserOrder() from service returns error', () => {
    spyOn(orderService, 'getUserOrder').and.callFake(() => throwError(new Error('a')));
    let spy = spyOn(router, 'navigate');

    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(['/user/orders'])
  });

  it('should update order status when change status is called', () => {
    spyOn(orderService, 'getUserOrder').and.returnValue(of(orderStub));
    let spyOrderService = spyOn(orderService, 'update').and.returnValue(of(Object));
    let spyRouter = spyOn(router, 'navigate');

    fixture.detectChanges();
    component.changeStatus();

    expect(spyOrderService).toHaveBeenCalled();
    expect(spyRouter).toHaveBeenCalledWith(['/admin/orders']);
  });
});
