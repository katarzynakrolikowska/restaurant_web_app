import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MenuService } from 'shared/services/menu.service';
import { menuItemStubWithTwoDishes } from 'shared/test/stubs/menu-item.stub';
import { HomeComponent } from './home.component';


describe('HomeComponent', () => {
  const baseURL = '';
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let menuService: MenuService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ],
      imports: [
        HttpClientModule,
      ],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    menuService = TestBed.get(MenuService);
    spyOn(menuService, 'getMainItem').and.returnValue(of(menuItemStubWithTwoDishes));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize main menu item', () => {
    expect(component.mainMenuItem).toBe(menuItemStubWithTwoDishes);
  });
});
