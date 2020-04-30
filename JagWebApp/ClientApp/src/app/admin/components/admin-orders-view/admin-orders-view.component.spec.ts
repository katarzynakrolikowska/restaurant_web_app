import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTableModule } from '@angular/material';
import { of } from 'rxjs';
import { OrderService } from 'shared/services/order.service';
import { orderStub } from 'shared/test/stubs/order.stub';
import { AdminOrdersViewComponent } from './admin-orders-view.component';


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
    spyOn(orderService, 'getAll').and.returnValue(of([orderStub]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
