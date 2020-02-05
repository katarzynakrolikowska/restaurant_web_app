import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainMenuItemViewComponent } from './main-menu-item-view.component';

describe('MainMenuItemViewComponent', () => {
  let component: MainMenuItemViewComponent;
  let fixture: ComponentFixture<MainMenuItemViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainMenuItemViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuItemViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
