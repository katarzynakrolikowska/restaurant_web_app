import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDishesMenuComponent } from './admin-dishes-menu.component';

xdescribe('AdminDishesMenuComponent', () => {
  let component: AdminDishesMenuComponent;
  let fixture: ComponentFixture<AdminDishesMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDishesMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDishesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
