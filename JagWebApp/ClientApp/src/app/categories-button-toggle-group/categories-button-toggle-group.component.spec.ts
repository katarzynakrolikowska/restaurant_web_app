import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material';
import { of } from 'rxjs';
import { categoryAStub } from '../../test/stubs/category.stub';
import { Category } from '../models/category';
import { CategoryService } from '../services/category.service';
import { CategoriesButtonToggleGroupComponent } from './categories-button-toggle-group.component';

describe('CategoriesButtonToggleGroupComponent', () => {
  const baseURL = '';
  let categories: Array<Category>;
  let component: CategoriesButtonToggleGroupComponent;
  let fixture: ComponentFixture<CategoriesButtonToggleGroupComponent>;
  let categoryService: CategoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesButtonToggleGroupComponent],
      imports: [HttpClientModule, MatButtonToggleModule],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesButtonToggleGroupComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.get(CategoryService);
    categories = [categoryAStub];
    spyOn(categoryService, 'getCategories').and.returnValue(of(categories));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init categories', () => {
    expect(component.categories.length).toBe(3);
  });

  it('should emit event when toggle method is called', () => {
    let spy = spyOn(component.onToggleCategory, 'emit');

    component.toggle(1);

    expect(spy).toHaveBeenCalledWith(1);
  });
});
