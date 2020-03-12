import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { activatedRouteStub } from '../../test/stubs/activated-route.stub';
import { AdminDishFormComponent } from './admin-dish-form.component';


describe('AdminDishFormComponent', () => {
    const baseURL = '';
    let nameControl: AbstractControl;
    let categoryControl: AbstractControl;
    let amountControl: AbstractControl;

    let component: AdminDishFormComponent;
    let fixture: ComponentFixture<AdminDishFormComponent>;
    let categoryService: CategoryService;
    let dishService: DishService;

    let dish: Dish;
    let spyUpdateDish;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminDishFormComponent],
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
        fixture = TestBed.createComponent(AdminDishFormComponent);
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

    it('should NOT call the server to save dish after submit if form is invalid', () => {
        let spy = spyOn(dishService, 'createDish').and.returnValue(empty());

        component.onSave();

        expect(spy).not.toHaveBeenCalled();
    });

    it('should call the server to update dish if id is valid number', () => {
        component.onSave();

        expect(spyUpdateDish).toHaveBeenCalled();
    });
});
