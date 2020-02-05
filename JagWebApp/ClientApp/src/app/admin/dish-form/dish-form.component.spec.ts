import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { DishFormComponent } from './dish-form.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractControl } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { of, empty } from 'rxjs';
import { DishService } from '../../services/dish.service';
import { ActivatedRoute } from '@angular/router';
import { Dish } from '../../models/dish';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { activatedRouteStub } from '../../test-stub/activated-route.stub';


describe('DishFormComponent', () => {
    const baseURL = '';
    let nameControl: AbstractControl;
    let categoryControl: AbstractControl;
    let amountControl: AbstractControl;

    let component: DishFormComponent;
    let fixture: ComponentFixture<DishFormComponent>;
    let categoryService: CategoryService;
    let dishService: DishService;

    let dish: Dish;
    let spyUpdateDish;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DishFormComponent],
            imports: [
                HttpClientModule,
                ToastrModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                BrowserAnimationsModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },
                { provide: ActivatedRoute, useValue: activatedRouteStub }
                
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DishFormComponent);
        component = fixture.componentInstance;
        categoryService = TestBed.get(CategoryService);
        dishService = TestBed.get(DishService);
        dish = { name: 'a', amount: 1, categoryId: 1, id: 1 };

        spyOn(categoryService, 'getCategories').and.returnValue(of([{ id: 1, name: 'z' }]));
        spyOn(dishService, 'getDish').and.returnValue(of(dish));
        spyUpdateDish = spyOn(dishService, 'updateDish').and.returnValue(empty());

        fixture.detectChanges();

        nameControl = component.name;
        categoryControl = component.category;
        amountControl = component.amount;
        
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with three controls', () => {
        expect(nameControl).toBeTruthy();
        expect(categoryControl).toBeTruthy();
        expect(amountControl).toBeTruthy();
    });

    it('should make name control required', () => {
        nameControl.setValue('');

        expect(nameControl.invalid).toBeTruthy();
    });

    it('should make category control required', () => {
        categoryControl.setValue('');

        expect(categoryControl.invalid).toBeTruthy();
    });

    it('should make amount control required', () => {
        amountControl.setValue('');

        expect(amountControl.invalid).toBeTruthy();
    });

    it('should make amount accepts positive integers', () => {
        amountControl.setValue(0);

        expect(amountControl.invalid).toBeTruthy();
    });

    xit('should call the server to save dish after submit if form is valid', () => {
        //activatedRouteStub.snapshot.params.id = 'new';
        let spy = spyOn(dishService, 'createDish').and.returnValue(empty());
        setControls();

        component.onSave();

        //expect(component.id).toBe(2);
        expect(spy).toHaveBeenCalled();
    });

    it('should NOT call the server to save dish after submit if form is invalid', () => {
        let spy = spyOn(dishService, 'createDish').and.returnValue(empty());

        component.onSave();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should call the server to update dish if id is valid number', () => {
        //activatedRouteStub.snapshot.params.id = '1';

        component.onSave();

        //expect(component.id).toBe(1);
        expect(spyUpdateDish).toHaveBeenCalled();
    });

    function setControls() {
        nameControl.setValue('a');
        categoryControl.setValue(1);
    }
});
