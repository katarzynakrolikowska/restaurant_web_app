import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesButtonToggleGroupComponent } from './categories-button-toggle-group.component';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonToggleModule } from '@angular/material';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { categoryStub } from '../test-stub/category.stub';
import { of } from 'rxjs';

describe('CategoriesButtonToggleGroupComponent', () => {
    const baseURL = '';
    let categories: Array<Category>;
    let component: CategoriesButtonToggleGroupComponent;
    let fixture: ComponentFixture<CategoriesButtonToggleGroupComponent>;
    let categoryService: CategoryService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CategoriesButtonToggleGroupComponent],
            imports: [
                HttpClientModule, MatButtonToggleModule
            ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },

            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CategoriesButtonToggleGroupComponent);
        component = fixture.componentInstance;
        categoryService = TestBed.get(CategoryService);
        categories = [categoryStub];
        spyOn(categoryService, 'getCategories').and.returnValue(of(categories));
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init categories', () => {
        expect(component.categories.length).toBe(2);
    });

    it('should emit event when toggle method is called', () => {
        let spy = spyOn(component.onToggleCategory, 'emit');

        component.toggle(1);

        expect(spy).toHaveBeenCalledWith(1);
    });
});
