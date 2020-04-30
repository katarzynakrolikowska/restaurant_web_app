import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialog, MatDialogModule, MatTableModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { empty, of, throwError } from 'rxjs';
import { Dish } from 'shared/models/dish';
import { dishStub } from 'shared/test/stubs/dish.stub';
import { DishService } from '../../services/dish.service';
import { AdminDishesViewComponent } from './admin-dishes-view.component';


describe('AdminDishesViewComponent', () => {
  const baseURL = '';
  let component: AdminDishesViewComponent;
  let fixture: ComponentFixture<AdminDishesViewComponent>;
  let dishService: DishService;
  let dialog;
  let dishes: Array<Dish> = [dishStub];
  let toastr: ToastrService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminDishesViewComponent],
      imports: [
        MatTableModule,
        MatDialogModule,
        MatButtonModule,
        HttpClientModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDishesViewComponent);
    component = fixture.componentInstance;
    dishService = TestBed.get(DishService);
    spyOn(dishService, 'getAll').and.returnValue(of(dishes));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should open dialog after called openConfirmingDialog', () => {
    dialog = TestBed.get(MatDialog);
    let spy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    spyOn(dishService, 'delete').and.returnValue(empty());

    component.openConfirmingDialog(1);

    expect(spy).toHaveBeenCalled();
  });

  it('should remove dish if user confirmed dialog', () => {
    dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    let spy = spyOn(dishService, 'delete').and.returnValue(of(Object));

    component.openConfirmingDialog(1);

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should NOT remove dish if user not confirmed dialog', () => {
    dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) });
    let spy = spyOn(dishService, 'delete').and.returnValue(of(Object));

    component.openConfirmingDialog(1);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should NOT remove dish if service returns error', () => {
    dialog = TestBed.get(MatDialog);
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    spyOn(dishService, 'delete').and.callFake(() => throwError(new Error('a')));
    toastr = TestBed.get(ToastrService);
    let spy = spyOn(toastr, 'error');

    component.openConfirmingDialog(1);

    expect(spy).toHaveBeenCalled();
  });

  it('should redirect user to edit dish page after called onEditClick', () => {
    let router = TestBed.get(Router);
    let spy = spyOn(router, 'navigate');

    component.onEditClick(1);

    expect(spy).toHaveBeenCalledWith(['admin/dishes/edit/1']);
  });
});
