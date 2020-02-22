import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMenuFormComponent } from './admin-menu-form.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material';
import { AbstractControl } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { of, throwError } from 'rxjs';
import { Dish } from '../../models/dish';
import { MenuService } from '../../services/menu.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { BlankComponent } from '../../test/blank/blank.component';
import { menuItemStubWithTwoDishes } from '../../test/stubs/menu-item.stub';

describe('AdminMenuFormComponent', () => {
    const baseURL = '';
    const dish1: Dish = {
        id: 1,
        name: 'A',
        category: { id: 2, name: 'categoryA' },
        amount: 4
    };
    const dish2: Dish = {
        id: 2,
        name: 'B',
        category: { id: 3, name: 'categoryB' },
        amount: 4
    };
    let dishes = [dish1, dish2];
    let toastr: ToastrService;

    let dishControl: AbstractControl;
    let priceControl: AbstractControl;
    let limitControl: AbstractControl;

    let dishService: DishService;
    let menuService: MenuService;
    let router: Router

    let component: AdminMenuFormComponent;
    let fixture: ComponentFixture<AdminMenuFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminMenuFormComponent, BlankComponent],
            imports: [
                HttpClientModule,
                MatAutocompleteModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                RouterTestingModule.withRoutes([
                    { path: 'menu', component: BlankComponent }
                ])
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
        menuService = TestBed.get(MenuService);
        toastr = TestBed.get(ToastrService);
        router = TestBed.get(Router);
        spyOn(router, 'navigate');
        spyOn(dishService, 'getDishes').and.returnValue(of(dishes));
        fixture.detectChanges();

        dishControl = component.dish;
        priceControl = component.price;
        limitControl = component.available;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with three controls', () => {
        expect(dishControl).toBeTruthy();
        expect(priceControl).toBeTruthy();
        expect(limitControl).toBeTruthy();
    });

    it('should make price control required', () => {
        priceControl.setValue('');

        expect(priceControl.invalid).toBeTruthy();
    });

    it('should make limit control required', () => {
        limitControl.setValue('');

        expect(limitControl.invalid).toBeTruthy();
    });

    it('should set filteredDishesGroup', () => {
        expect(component.filteredDishesGroup.length).toBe(2);
        expect(component.filteredDishesGroup[0].categoryName).toBe('categoryA');
    });

    it('should update dishesToSave when updateDishesToSave is callled', () => {
        component.updateDishesToSave([dish1]);

        expect(component.dishesToSave.length).toBe(1);
    });

    it('should set error of dish control when dishesToSave is empty after updating', () => {
        component.updateDishesToSave([]);

        expect(dishControl.errors).toEqual({ dishesEmpty: true });
    });

    it('should add dish to save list when addDishToSaveList is called and main item is creating', () => {
        component.routeParam = 'mainitem';
        component.dishesToSave = [];

        component.addDishToSaveList(dish1);

        expect(component.dishesToSave.includes(dish1)).toBeTruthy();
    });

    it('should NOT add dish to save list when addDishToSaveList is called and ordinary item is creating', () => {
        component.routeParam = 'item';
        component.dishesToSave = [];

        component.addDishToSaveList(dish1);

        expect(component.dishesToSave.includes(dish1)).toBeFalsy();
    }); 

    it('should create menu item when onSave is called, form is valid and main item to update is undefined', () => {
        let spy = spyOn(menuService, 'create').and.returnValue(of(Object));
        setFormsControl();

        component.onSave();

        expect(spy).toHaveBeenCalled();
    });

    it('should show error when onSave is called and item creating failed', () => {
        spyOn(menuService, 'create').and.callFake(() => throwError(new Error('error')));
        let spy = spyOn(toastr, 'error');
        setFormsControl();

        component.onSave();

        expect(spy).toHaveBeenCalled();
    });

    it('should update menu item when onSave is called, form is valid and main item to update is defined', () => {
        component.mainMenuItemToUpdate = menuItemStubWithTwoDishes;
        let spy = spyOn(menuService, 'updateItem').and.returnValue(of(Object));
        setFormsControl();

        component.onSave();

        expect(spy).toHaveBeenCalled();
    });

    function setFormsControl() {
        dishControl.setValue(dish1);
        priceControl.setValue(1);
        limitControl.setValue(1);
    }
});
