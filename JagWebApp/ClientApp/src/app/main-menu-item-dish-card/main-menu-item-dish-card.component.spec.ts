import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainMenuItemDishCardComponent } from './main-menu-item-dish-card.component';


xdescribe('MainMenuItemDishCardComponent', () => {
  let component: MainMenuItemDishCardComponent;
  let fixture: ComponentFixture<MainMenuItemDishCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMenuItemDishCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuItemDishCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
