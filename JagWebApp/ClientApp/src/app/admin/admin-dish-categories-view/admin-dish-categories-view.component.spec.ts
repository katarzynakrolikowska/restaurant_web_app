import { categoryAStub, categoryBStub } from './../../../test/stubs/category.stub';
import { of, throwError } from 'rxjs';
import { CategoryService } from './../../services/category.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialog } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AdminDishCategoriesViewComponent } from './admin-dish-categories-view.component';


describe('AdminDishCategoriesViewComponent', () => {
  const baseURL = '';
  let component: AdminDishCategoriesViewComponent;
  let categoryService;
  let dialog;
  let fixture: ComponentFixture<AdminDishCategoriesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDishCategoriesViewComponent ],
      imports: [
        HttpClientModule,
        MatDialogModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDishCategoriesViewComponent);
    component = fixture.componentInstance;
    categoryService = TestBed.get(CategoryService);
    dialog = TestBed.get(MatDialog);
    spyOn(categoryService, 'getCategories').and.returnValue(of([categoryAStub]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save new category when openNewCategoryDialog() is called and dialog returns valid category name', () => {
    let spy = spyOn(categoryService, 'save').and.returnValue(of(categoryBStub));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ category: 'b' }) });

    component.openNewCategoryDialog();

    expect(spy).toHaveBeenCalled();
    expect(component.categories.length).toBe(2);
  });

  it('should edit category when openEditCategoryDialog() is called and dialog returns valid category name', () => {
    let spy = spyOn(categoryService, 'update').and.returnValue(of(Object));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of({ category: 'b' }) });

    component.openEditCategoryDialog(categoryAStub);

    expect(spy).toHaveBeenCalled();
    expect(component.categories.find(c => c.id === categoryAStub.id).name).toBe('b');
  });

  it('should remove category when removeCategory() is called', () => {
    let spy = spyOn(categoryService, 'remove').and.returnValue(of(Object));

    component.removeCategory(categoryAStub.id);

    expect(spy).toHaveBeenCalled();
    expect(component.categories.length).toBe(0);
  });

  it('should NOT remove category when removeCategory() is called and remove() from categoryService returns error', () => {
    let spy = spyOn(categoryService, 'remove').and.callFake(() => throwError(new Error('a')));

    component.removeCategory(categoryAStub.id);

    expect(spy).toHaveBeenCalled();
    expect(component.categories.length).toBe(1);
  });
});
