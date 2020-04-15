import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { of } from 'rxjs';
import { UserDataTabsComponent } from './user-data-tabs.component';

const params: Params = { selected: 1};
const activatedRouteStub = {
  queryParams: of(params) 
};

describe('UserDataTabsComponent', () => {
  const baseURL = '';
  let component: UserDataTabsComponent;
  let fixture: ComponentFixture<UserDataTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDataTabsComponent],
      imports: [
        HttpClientModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ],
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

  it('should init selected', () => {
    expect(component.selected).toEqual(1);
  });
});
