import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDishCardComponent } from './admin-dish-card.component';
import { MatCardModule, MatDialogModule, MatDialog } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuService } from '../../services/menu.service';
import { of } from 'rxjs';
import { menuItemStub } from '../../test-stub/menu-item.stub';

describe('AdminDishCardComponent', () => {
    const baseURL = '';
    let component: AdminDishCardComponent;
    let fixture: ComponentFixture<AdminDishCardComponent>;
    let menuService: MenuService;
    let toastr: ToastrService;
    let dialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminDishCardComponent],
            imports: [HttpClientModule,
                MatCardModule,
                MatDialogModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule
            ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDishCardComponent);
        component = fixture.componentInstance;
        component.menuItem = menuItemStub;
        menuService = TestBed.get(MenuService);
        toastr = TestBed.get(ToastrService);
        dialog = TestBed.get(MatDialog);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call deleteItem from service when deleteItem is called', () => {
        let spyMenuService = spyOn(menuService, 'deleteItem').and.returnValue(of(Object));

        component.deleteItem(menuItemStub);

        expect(spyMenuService).toHaveBeenCalledWith(menuItemStub.id);
    });

    it('should show success toastr and emit event when deleteItem from service returns success', () => {
        spyOn(menuService, 'deleteItem').and.returnValue(of(Object));
        let spyToastr = spyOn(toastr, 'success');
        let spyEventEmitter = spyOn(component.onDeleteMenuItem, 'emit');

        component.deleteItem(1);

        expect(spyToastr).toHaveBeenCalled();
        expect(spyEventEmitter).toHaveBeenCalledWith(1);
    });

    it('should call updateLimit from service when updateLimit is called', () => {
        let spyMenuService = spyOn(menuService, 'updateLimit').and.returnValue(of(Object));

        component.updateLimit(1, 2);

        expect(spyMenuService).toHaveBeenCalledWith(1, 2);
    });

    it('should show success toastr and emit event when updateLimit from service returns success', () => {
        spyOn(menuService, 'updateLimit').and.returnValue(of(Object));
        let spyToastr = spyOn(toastr, 'success');
        let spyEventEmitter = spyOn(component.onUpdateMenuItem, 'emit');

        component.updateLimit(1, 2);

        expect(spyToastr).toHaveBeenCalled();
        expect(spyEventEmitter).toHaveBeenCalledWith({id: 1, limit: 2});
    });

    it('should open dialog when showModal is called', () => {
        let spy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(3) })
        spyOn(menuService, 'updateLimit').and.returnValue(of(Object));

        component.showModal(menuItemStub);

        expect(spy).toHaveBeenCalled();
    });

    it('should NOT call updateLimit when afterClosed returns undefined', () => {
        spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(undefined) })
        let spy = spyOn(menuService, 'updateLimit');

        component.showModal(menuItemStub);

        expect(spy).not.toHaveBeenCalled();
    });

    //it('should show error toastr when service returns error', () => {
    //    spyOn(menuService, 'deleteItem').and.callFake(function () {
    //        return throwError(new Error('test error'));
    //    });
    //    let spyToastr = spyOn(toastr, 'error');


    //    component.deleteItem(1);

    //    expect(spyToastr).toHaveBeenCalled();
    //});
});
