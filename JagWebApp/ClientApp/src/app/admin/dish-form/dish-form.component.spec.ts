import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishFormComponent } from './dish-form.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { AbstractControl } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { of, empty } from 'rxjs';
import { DishService } from '../../services/dish.service';


describe('DishFormComponent', () => {
    const baseURL = '';
    let component: DishFormComponent;
    let fixture: ComponentFixture<DishFormComponent>;
    let nameControl: AbstractControl;
    let categoryControl: AbstractControl;
    let priceControl: AbstractControl;
    let amountControl: AbstractControl;
    let categoryService: CategoryService;
    let dishService: DishService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DishFormComponent],
            imports: [HttpClientModule, ToastrModule.forRoot(), RouterTestingModule.withRoutes([])],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
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
        spyOn(categoryService, 'getCategories').and.returnValue(of([{id: 1, name: 'z'}]));
        fixture.detectChanges();

        nameControl = component.name;
        categoryControl = component.category;
        priceControl = component.price;
        amountControl = component.amount;
        
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with four controls', () => {
        expect(nameControl).toBeTruthy();
        expect(categoryControl).toBeTruthy();
        expect(priceControl).toBeTruthy();
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

    it('should make price control required', () => {
        priceControl.setValue('');

        expect(priceControl.invalid).toBeTruthy();
    });

    it('should make price accepts values greater than 0', () => {
        priceControl.setValue(0);

        expect(priceControl.invalid).toBeTruthy();
    });

    it('should make amount control required', () => {
        amountControl.setValue('');

        expect(amountControl.invalid).toBeTruthy();
    });

    it('should make amount accepts positive integers', () => {
        amountControl.setValue(0);

        expect(amountControl.invalid).toBeTruthy();
    });

    it('should call the server to save dish after submit if form is valid', () => {
        let spy = spyOn(dishService, 'createDish').and.returnValue(empty());
        setControls();

        component.onSave();

        expect(spy).toHaveBeenCalled();
    });

    it('should NOT call the server to save dish after submit if form is invalid', () => {
        let spy = spyOn(dishService, 'createDish').and.returnValue(empty());

        component.onSave();

        expect(spy).not.toHaveBeenCalled();
    });

    function setControls() {
        nameControl.setValue('a');
        categoryControl.setValue(1);
        priceControl.setValue(1);
    }
});
