import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuViewComponent } from './menu-view.component';
import { MenuService } from '../services/menu.service';
import { mainMenuItemStubWithOneDish, mainMenuItemStubWithTwoDishes } from '../test/stubs/main-menu-item.stub';
import { ordinaryMenuItemStub } from '../test/stubs/ordinary-menu-item.stub';
import { CATEGORY_ALL_MENU_ITEMS_ID } from '../consts/app-consts';


describe('MenuViewComponent', () => {
    const baseURL = '';
    let component: MenuViewComponent;
    let fixture: ComponentFixture<MenuViewComponent>;
    let menuService: MenuService;

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
            .returnValue(of([mainMenuItemStubWithOneDish, mainMenuItemStubWithTwoDishes]));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init menuItems', () => {
        expect(component.ordinaryMenuItems.length).toBe(1);
        expect(component.mainMenuItem).toBe(mainMenuItemStubWithTwoDishes);
    });

    it('should remove menu item when removeItemFromMenu is called and item category is current selected catogory', () => {
        component.toggleCategory(ordinaryMenuItemStub.dish.category.id);
        component.removeItemFromMenu(ordinaryMenuItemStub)

        expect(component.ordinaryMenuItems.length).toBe(0);
        expect(component.filteredMenuItems.length).toBe(0);
    });

    it('should remove menu item when removeItemFromMenu is called and item category is NOT current selected catogory', () => {
        component.toggleCategory(ordinaryMenuItemStub.dish.category.id + 1);
        component.removeItemFromMenu(ordinaryMenuItemStub)

        expect(component.ordinaryMenuItems.length).toBe(0);
    });

    it('should update menu item when updateItem is called', () => {
        let data = {
            id: 1,
            item: {
                price: 2,
                available: 2
            }
        };

        component.updateItem(data);
        let updatedItem = component.ordinaryMenuItems.filter(i => i.id === data.id)[0];

        expect(updatedItem.available).toBe(2);
        expect(updatedItem.price).toBe(2);
    });

    it('should filter menu items to all items when toggleCategory is called with CATEGORY_ALL_MENU_ITEMS_ID', () => {
        component.toggleCategory(CATEGORY_ALL_MENU_ITEMS_ID);

        expect(component.filteredMenuItems.length).toBe(1);
    });

    it('should filter menu items when toggleCategory is called with category id', () => {
        component.toggleCategory(2);

        expect(component.filteredMenuItems.length).toBe(0);
    });
});
