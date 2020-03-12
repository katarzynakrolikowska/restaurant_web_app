import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuViewComponent } from './menu-view.component';
import { MenuService } from '../services/menu.service';
import { menuItemStubWithOneDish, menuItemStubWithTwoDishes } from '../test/stubs/menu-item.stub';
import { ALL_MENU_ITEMS_CATEGORY_ID  } from '../consts/app.consts';
import { SignalRService } from '../services/signal-r.service';


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
            imports: [
                HttpClientModule, RouterTestingModule.withRoutes([])
                ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuViewComponent);
        component = fixture.componentInstance;
        menuService = TestBed.get(MenuService);
        spyOn(menuService, 'getMenuItems').and
            .returnValue(of([menuItemStubWithOneDish, menuItemStubWithTwoDishes]));
        spyOn(document, "getElementById").and.returnValue(element);
        signalRService = TestBed.get(SignalRService);
    });

    it('should create', () => {
        mockSignalRService();
        fixture.detectChanges();

        expect(component).toBeTruthy();
    });

    it('should init menuItems', () => {
        expect(component.ordinaryMenuItems.length).toBe(1);
        expect(component.mainMenuItem).toBe(menuItemStubWithTwoDishes);
    });

    it('should filter menu items to all items when toggleCategory is called with CATEGORY_ALL_MENU_ITEMS_ID', () => {
        mockSignalRService();
        fixture.detectChanges();
        component.toggleCategory(ALL_MENU_ITEMS_CATEGORY_ID);

        expect(component.filteredMenuItems.length).toBe(1);
    });

    it('should filter menu items when toggleCategory is called with category id', () => {
        component.toggleCategory(2);

        expect(component.filteredMenuItems.length).toBe(0);
    });

    function mockSignalRService() {
        (signalRService as any).startConnection = () => { };
        (signalRService as any).addTransferUpdatedItemListener = () => { };
        (signalRService as any).addTransferDeletedItemListener = () => { };
    }
});
