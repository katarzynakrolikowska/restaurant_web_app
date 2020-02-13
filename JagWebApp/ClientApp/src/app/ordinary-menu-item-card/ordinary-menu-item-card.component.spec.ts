import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCardModule, MatDialogModule, MatDialog } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OrdinaryMenuItemCardComponent } from './ordinary-menu-item-card.component';
import { MenuService } from '../services/menu.service';
import { ordinaryMenuItemStub } from '../test/stubs/ordinary-menu-item.stub';
import { updateMenuItemStub } from '../test/stubs/update-menu-item.stub';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrdinaryMenuItemCardComponent', () => {
    const baseURL = '';
    let component: OrdinaryMenuItemCardComponent;
    let fixture: ComponentFixture<OrdinaryMenuItemCardComponent>;
    let menuService: MenuService;
    let toastr: ToastrService;
    let dialog;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrdinaryMenuItemCardComponent],
            imports: [HttpClientModule,
                MatCardModule,
                MatDialogModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule
            ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrdinaryMenuItemCardComponent);
        component = fixture.componentInstance;
        component.menuItem = ordinaryMenuItemStub;
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

        component.deleteItem(ordinaryMenuItemStub);

        expect(spyMenuService).toHaveBeenCalledWith(ordinaryMenuItemStub.id);
    });

    it('should show success toastr and emit event when deleteItem from service returns success', () => {
        spyOn(menuService, 'deleteItem').and.returnValue(of(Object));
        let spyToastr = spyOn(toastr, 'success');
        let spyEventEmitter = spyOn(component.onDeleteMenuItem, 'emit');

        component.deleteItem(ordinaryMenuItemStub);

        expect(spyToastr).toHaveBeenCalled();
        expect(spyEventEmitter).toHaveBeenCalledWith(ordinaryMenuItemStub);
    });

    it('should call updateItem from service when updateItem is called', () => {
        let spyMenuService = spyOn(menuService, 'updateItem').and.returnValue(of(Object));

        component.updateItem(jasmine.any(Number), updateMenuItemStub);

        expect(spyMenuService).toHaveBeenCalledWith(jasmine.any(Number), updateMenuItemStub);
    });

    it('should show success toastr and emit event when updateItem from service returns success', () => {
        spyOn(menuService, 'updateItem').and.returnValue(of(Object));
        let spyToastr = spyOn(toastr, 'success');
        let spyEventEmitter = spyOn(component.onUpdateMenuItem, 'emit');

        component.updateItem(jasmine.any(Number), updateMenuItemStub);

        expect(spyToastr).toHaveBeenCalled();
        expect(spyEventEmitter).toHaveBeenCalledWith({ item: updateMenuItemStub, id: jasmine.any(Number)});
    });

    it('should open dialog when showModal is called', () => {
        let spy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(Object) })
        spyOn(menuService, 'updateItem').and.returnValue(of(Object));

        component.showModal(ordinaryMenuItemStub);

        expect(spy).toHaveBeenCalled();
    });

    it('should NOT call updateLimit when afterClosed returns undefined', () => {
        spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(undefined) })
        let spy = spyOn(menuService, 'updateItem');

        component.showModal(ordinaryMenuItemStub);

        expect(spy).not.toHaveBeenCalled();
    });
});
