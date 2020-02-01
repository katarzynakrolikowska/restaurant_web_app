import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDishCardComponent } from './admin-dish-card.component';

describe('AdminDishCardComponent', () => {
  let component: AdminDishCardComponent;
  let fixture: ComponentFixture<AdminDishCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDishCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDishCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
