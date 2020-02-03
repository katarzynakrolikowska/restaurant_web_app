import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDishesMenuComponent } from './admin-dishes-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MenuItem } from '../../models/menuItem';
import { menuItemStub } from '../../test-stub/menu-item.stub';
import { MenuService } from '../../services/menu.service';
import { of } from 'rxjs';

describe('AdminDishesMenuComponent', () => {
    const baseURL = '';
    let menuItems: Array<MenuItem>;
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
        menuItems = [menuItemStub];
        menuService = TestBed.get(MenuService);
        spyOn(menuService, 'getMenuItems').and.returnValue(of(menuItems));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init menuItems', () => {
        expect(component.menuItems.length).toBe(1);
    });

    it('should remove menu item when removeItemFromMenu is called', () => {
        component.removeItemFromMenu(1)

        expect(component.menuItems.length).toBe(0);
        expect(component.filteredMenuItems.length).toBe(0);
    });

    it('should update menu item when updateItemLimit is called', () => {
        let data = { id: 1, limit: 2 };

        component.updateItemLimit(data);
        let item = component.menuItems.filter(i => i.id === data.id)[0];
        expect(item.available).toBe(2);
    });

    it('should filter menu items to all items when toggle is called with 0', () => {
        component.toggle(0);

        expect(component.filteredMenuItems.length).toBe(1);
    });

    it('should filter menu items when toggle is called with category id', () => {
        component.toggle(2);

        expect(component.filteredMenuItems.length).toBe(0);
    });
});
