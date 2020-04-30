import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ALL_MENU_ITEMS_CATEGORY_ID } from 'shared/consts/app.consts';
import { MenuService } from 'shared/services/menu.service';
import { SignalRService } from 'shared/services/signal-r.service';
import { mockSignalRService } from 'shared/test/mocks/signal-r.mock';
import { menuItemStubWithOneDish, menuItemStubWithTwoDishes } from 'shared/test/stubs/menu-item.stub';
import { MenuViewComponent } from './menu-view.component';


describe('MenuViewComponent', () => {
  const baseURL = '';

  let component: MenuViewComponent;
  let fixture: ComponentFixture<MenuViewComponent>;
  let menuService: MenuService;
  let element: HTMLElement = document.createElement('div');
  let signalRService: SignalRService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MenuViewComponent],
      imports: [HttpClientModule, RouterTestingModule.withRoutes([])],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuViewComponent);
    component = fixture.componentInstance;
    menuService = TestBed.get(MenuService);
    spyOn(menuService, 'getAll').and
      .returnValue(of([menuItemStubWithOneDish, menuItemStubWithTwoDishes]));
    spyOn(document, "getElementById").and.returnValue(element);
    signalRService = TestBed.get(SignalRService);
    mockSignalRService(signalRService, component);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init menuItems', () => {
    expect(component.ordinaryMenuItems.length).toBe(1);
    expect(component.mainMenuItem).toBe(menuItemStubWithTwoDishes);
  });

  it('should filter menu items to all items when toggleCategory is called with CATEGORY_ALL_MENU_ITEMS_ID', () => {
    component.toggleCategory(ALL_MENU_ITEMS_CATEGORY_ID);

    expect(component.filteredMenuItems.length).toBe(1);
  });

  it('should filter menu items when toggleCategory is called with category id', () => {
    component.toggleCategory(2);

    expect(component.filteredMenuItems.length).toBe(0);
  });
});
