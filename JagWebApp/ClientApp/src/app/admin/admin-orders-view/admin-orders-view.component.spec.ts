import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersViewComponent } from './admin-orders-view.component';

describe('AdminOrdersViewComponent', () => {
  let component: AdminOrdersViewComponent;
  let fixture: ComponentFixture<AdminOrdersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminOrdersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
