import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule, MatDialogModule, MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { menuItemStubWithTwoDishes } from '../../test/stubs/menu-item.stub';
import { MenuService } from '../services/menu.service';
import { MainMenuItemViewComponent } from './main-menu-item-view.component';

describe('MainMenuItemViewComponent', () => {
  const baseURL = '';

  let component: MainMenuItemViewComponent;
  let fixture: ComponentFixture<MainMenuItemViewComponent>;
  let menuService: MenuService;
  let router: Router;
  let dialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainMenuItemViewComponent],
      imports: [
        HttpClientModule,
        MatToolbarModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        MatDialogModule,
        RouterTestingModule.withRoutes([])],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuItemViewComponent);
    component = fixture.componentInstance;
    component.mainMenuItem = menuItemStubWithTwoDishes;
    menuService = TestBed.get(MenuService);
    router = TestBed.get(Router);
    dialog = TestBed.get(MatDialog);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect user to main item creating form when onButtonClick is called with first button label', () => {
    let spy = spyOn(router, 'navigate');

    component.onButtonClick(component.buttons[0].label);

    expect(spy).toHaveBeenCalledWith(['admin/menu/mainitem/new']);
  });

  it('should redirect user to main item editin form when onButtonClick is called with second button label and main item is defined', () => {
    component.mainMenuItem = menuItemStubWithTwoDishes;  
    let spy = spyOn(router, 'navigate');

    component.onButtonClick(component.buttons[1].label);

    expect(spy).toHaveBeenCalledWith(['admin/menu/mainitem/edit/' + component.mainMenuItem.id]);
  });

  it('should remove main item when onButtonClick is called with "delete" button label and confirming dialog returns true', () => {
    component.mainMenuItem = menuItemStubWithTwoDishes;
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    let spy = spyOn(menuService, 'deleteItem').and.returnValue(of(Object));

    component.onButtonClick(component.buttons[2].label);

    expect(spy).toHaveBeenCalledWith(component.mainMenuItem.id);
  });
});
