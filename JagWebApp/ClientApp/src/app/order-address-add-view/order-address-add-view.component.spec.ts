import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAddressAddViewComponent } from './order-address-add-view.component';

describe('OrderAddressAddViewComponent', () => {
  let component: OrderAddressAddViewComponent;
  let fixture: ComponentFixture<OrderAddressAddViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAddressAddViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAddressAddViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
