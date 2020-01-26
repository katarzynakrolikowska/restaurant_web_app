import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishesComponent } from './dishes.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatTableModule, MatDialogModule, MatButtonModule, MatDialog } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { DishService } from '../../services/dish.service';
import { of, empty } from 'rxjs';
import { Dish } from '../../models/dish';
import { Router } from '@angular/router';


describe('DishesComponent', () => {
    const baseURL = '';
    let component: DishesComponent;
    let fixture: ComponentFixture<DishesComponent>;
    let dishService: DishService;
    let dialog;
    let dish: Dish = {
        id: 1,
        name: 'a',
        category: {
            id: 1,
            name: 'b'
        },
        price: 1,
        amount: 1
    };
    let dishes: Array<Dish> = [dish];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DishesComponent],
            imports: [MatTableModule, MatDialogModule, MatButtonModule, HttpClientModule, ToastrModule.forRoot(),
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
        fixture = TestBed.createComponent(DishesComponent);
        component = fixture.componentInstance;
        dishService = TestBed.get(DishService);
        spyOn(dishService, 'getDishes').and.returnValue(of(dishes));

        fixture.detectChanges();
    });
    

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
    it('should open dialog after called openConfirmingDialog', () => {
        dialog = TestBed.get(MatDialog);
        let spy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
        spyOn(dishService, 'deleteDish').and.returnValue(empty());

        component.openConfirmingDialog(1);

        expect(spy).toHaveBeenCalled();
    });

    it('should remove dish if user confirmed dialog', () => {
        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
        let spy = spyOn(dishService, 'deleteDish').and.returnValue(empty());

        component.openConfirmingDialog(1);

        expect(spy).toHaveBeenCalledWith(1);
    });

    it('should NOT remove dish if user not confirmed dialog', () => {
        dialog = TestBed.get(MatDialog);
        spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) });
        let spy = spyOn(dishService, 'deleteDish').and.returnValue(empty());

        component.openConfirmingDialog(1);

        expect(spy).not.toHaveBeenCalled();
    });

    it('should redirect user to edit dish page with proper id after called onEditClick', () => {
        let router = TestBed.get(Router);
        let spy = spyOn(router, 'navigate');

        component.onEditClick(1);

        expect(spy).toHaveBeenCalledWith(['admin/dishes/edit/1']);
    });

});
