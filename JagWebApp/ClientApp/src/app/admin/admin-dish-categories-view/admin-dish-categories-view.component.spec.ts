import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDishCategoriesViewComponent } from './admin-dish-categories-view.component';

describe('AdminDishCategoriesViewComponent', () => {
  let component: AdminDishCategoriesViewComponent;
  let fixture: ComponentFixture<AdminDishCategoriesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDishCategoriesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDishCategoriesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
