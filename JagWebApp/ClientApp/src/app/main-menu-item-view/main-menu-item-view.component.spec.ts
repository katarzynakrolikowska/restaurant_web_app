import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainMenuItemViewComponent } from './main-menu-item-view.component';
import { MatToolbarModule } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MenuService } from '../services/menu.service';
import { RouterTestingModule } from '@angular/router/testing';
import { menuItemStubWithTwoDishes } from '../test/stubs/menu-item.stub';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('MainMenuItemViewComponent', () => {
    const baseURL = '';

    let component: MainMenuItemViewComponent;
    let fixture: ComponentFixture<MainMenuItemViewComponent>;
    let menuService: MenuService;
    let router: Router;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainMenuItemViewComponent],
            imports: [HttpClientModule, MatToolbarModule, ToastrModule.forRoot(),
                BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
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

    it('should remove main item when onButtonClick is called with third button label and main item is defined', () => {
        component.mainMenuItem = menuItemStubWithTwoDishes;
        let spy = spyOn(menuService, 'deleteItem').and.returnValue(of(Object));

        component.onButtonClick(component.buttons[2].label);

        expect(spy).toHaveBeenCalledWith(component.mainMenuItem.id);
    });
});
