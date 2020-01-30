import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuFormComponent } from './admin-menu-form.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material';
import { AbstractControl } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { of } from 'rxjs';
import { Dish } from '../../models/dish';
import { MenuService } from '../../services/menu.service';

describe('AdminMenuFormComponent', () => {
    const baseURL = '';
    const dish1: Dish = {
        id: 1,
        name: 'A',
        category: { id: 2, name: 'categoryA' },
        price: 3,
        amount: 4
    };
    const dish2: Dish = {
        id: 2,
        name: 'B',
        category: { id: 3, name: 'categoryB' },
        price: 3,
        amount: 4
    };
    let dishes = [dish1, dish2];
    let dishControl: AbstractControl;
    let limitControl: AbstractControl;

    let dishService: DishService;

    let component: AdminMenuFormComponent;
    let fixture: ComponentFixture<AdminMenuFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminMenuFormComponent],
            imports: [
                HttpClientModule,
                MatAutocompleteModule
                ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminMenuFormComponent);
        component = fixture.componentInstance;
        dishService = TestBed.get(DishService);
        
        spyOn(dishService, 'getDishes').and.returnValue(of(dishes));
        fixture.detectChanges();

        dishControl = component.dish;
        limitControl = component.limit;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with two controls', () => {
        expect(dishControl).toBeTruthy();
        expect(limitControl).toBeTruthy();
    });

    it('should make dish control required', () => {
        dishControl.setValue('');

        expect(dishControl.invalid).toBeTruthy();
    });

    it('should make limit control required', () => {
        limitControl.setValue('');

        expect(limitControl.invalid).toBeTruthy();
    });

    it('should set filteredDishesGroup', () => {
        expect(component.filteredDishesGroup.length).toBe(2);
        expect(component.filteredDishesGroup[0].categoryName).toBe('categoryA');
    });

    it('should create menu item when onSave is called and form is valid', () => {
        setFormsControl();
        let menuService = TestBed.get(MenuService);
        let spy = spyOn(menuService, 'create').and.returnValue(of(Object));

        component.onSave();

        expect(spy).toHaveBeenCalled();
    });

    it('should NOT create menu item when onSave is called and form is invalid', () => {
        let menuService = TestBed.get(MenuService);
        let spy = spyOn(menuService, 'create').and.returnValue(of(Object));

        component.onSave();

        expect(spy).not.toHaveBeenCalled();
    });

    function setFormsControl() {
        dishControl.setValue(dish1);
        limitControl.setValue(1);
    }
});
