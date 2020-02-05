import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainDishCardComponent } from './main-dish-card.component';

xdescribe('MainDishCardComponent', () => {
  let component: MainDishCardComponent;
  let fixture: ComponentFixture<MainDishCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainDishCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainDishCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
