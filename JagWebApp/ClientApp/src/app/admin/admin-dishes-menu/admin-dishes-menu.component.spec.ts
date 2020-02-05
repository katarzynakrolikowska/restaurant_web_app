import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDishesMenuComponent } from './admin-dishes-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MenuService } from '../../services/menu.service';
import { of } from 'rxjs';
import { ordinaryMenuItemStub } from '../../test-stub/ordinary-menu-item.stub';
import { mainMenuItemStubWithOneDish, mainMenuItemStubWithTwoDishes } from '../../test-stub/main-menu-item.stub';
import { MainMenuItem } from '../../models/main-menu-item';

describe('AdminDishesMenuComponent', () => {
    const baseURL = '';
    let component: AdminDishesMenuComponent;
    let fixture: ComponentFixture<AdminDishesMenuComponent>;
    let menuService: MenuService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminDishesMenuComponent],
            imports: [
                HttpClientModule
                ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },

            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDishesMenuComponent);
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

    it('should add menu item when addMenuItem is called', () => {
        let item: MainMenuItem = Object.assign({}, mainMenuItemStubWithOneDish);
        item.id = 3;

        component.toggleCategory(item.dishes[0].category.id);
        component.addMenuItem(item);

        expect(component.ordinaryMenuItems.length).toBe(2);
        expect(component.filteredMenuItems.length).toBe(2);
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
        let item = {
            id: 1,
            data: {
                price: 2,
                available: 2
            }
        };

        component.updateItem(item);
        let updatedItem = component.ordinaryMenuItems.filter(i => i.id === item.id)[0];

        expect(updatedItem.available).toBe(2);
        expect(updatedItem.price).toBe(2);
    });

    it('should filter menu items to all items when toggleCategory is called with 0', () => {
        component.toggleCategory(0);

        expect(component.filteredMenuItems.length).toBe(1);
    });

    it('should filter menu items when toggleCategory is called with category id', () => {
        component.toggleCategory(2);

        expect(component.filteredMenuItems.length).toBe(0);
    });
});
