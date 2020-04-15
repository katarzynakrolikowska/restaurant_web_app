import { orderStub } from './../../../test/stubs/order.stub';
import { orderedItemStub } from './../../../test/stubs/ordered-item.stub';
import { of } from 'rxjs';
import { OrderService } from './../../services/order.service';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersViewComponent } from './admin-orders-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material';

describe('AdminOrdersViewComponent', () => {
  const baseURL = '';
  let component: AdminOrdersViewComponent;
  let fixture: ComponentFixture<AdminOrdersViewComponent>;
  let orderService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrdersViewComponent ],
      imports: [
        MatTableModule,
        HttpClientModule
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdersViewComponent);
    component = fixture.componentInstance;
    orderService = TestBed.get(OrderService);
    spyOn(orderService, 'getOrders').and.returnValue(of([orderStub]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
