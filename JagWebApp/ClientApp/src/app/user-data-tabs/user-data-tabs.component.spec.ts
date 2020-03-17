import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDataTabsComponent } from './user-data-tabs.component';


xdescribe('UserDataTabsComponent', () => {
  let component: UserDataTabsComponent;
  let fixture: ComponentFixture<UserDataTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDataTabsComponent],
      schemas: [NO_ERRORS_SCHEMA]
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
