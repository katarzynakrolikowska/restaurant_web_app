import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishTabsComponent } from './dish-tabs.component';

describe('DishTabsComponent', () => {
  let component: DishTabsComponent;
  let fixture: ComponentFixture<DishTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DishTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DishTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
