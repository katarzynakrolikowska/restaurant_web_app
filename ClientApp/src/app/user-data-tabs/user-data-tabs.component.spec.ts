import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDataTabsComponent } from './user-data-tabs.component';

describe('UserDataTabsComponent', () => {
  let component: UserDataTabsComponent;
  let fixture: ComponentFixture<UserDataTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDataTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
