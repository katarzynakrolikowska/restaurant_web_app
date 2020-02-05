import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MainMenuItemViewComponent } from './main-menu-item-view.component';
import { MatToolbarModule, MatDialogModule, MatDialog } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { mainMenuItemStubWithTwoDishes } from '../test-stub/main-menu-item.stub';
import { MenuService } from '../services/menu.service';
import { updateMenuItemStub } from '../test-stub/update-menu-item.stub';
import { of } from 'rxjs';

describe('MainMenuItemViewComponent', () => {
    const baseURL = '';

    let component: MainMenuItemViewComponent;
    let fixture: ComponentFixture<MainMenuItemViewComponent>;
    let menuService: MenuService;
    let dialog;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MainMenuItemViewComponent],
            imports: [HttpClientModule, MatToolbarModule, MatDialogModule, ToastrModule.forRoot(),
                BrowserAnimationsModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainMenuItemViewComponent);
        component = fixture.componentInstance;
        component.mainMenuItem = mainMenuItemStubWithTwoDishes;
        menuService = TestBed.get(MenuService);
        dialog = TestBed.get(MatDialog);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call updateItem from service when updateItem is called', () => {
        let spyMenuService = spyOn(menuService, 'updateItem').and.returnValue(of(Object));
        updateMenuItemStub.id = component.mainMenuItem.id;

        component.updateItem(updateMenuItemStub.data);

        expect(spyMenuService).toHaveBeenCalledWith(updateMenuItemStub);
    });

    it('should open dialog when showModal is called', () => {
        let spy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(Object) })
        spyOn(menuService, 'updateItem').and.returnValue(of(Object));

        component.showModal();

        expect(spy).toHaveBeenCalled();
    });

    it('should NOT call updateLimit when afterClosed returns undefined', () => {
        spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(undefined) })
        let spy = spyOn(menuService, 'updateItem');

        component.showModal();

        expect(spy).not.toHaveBeenCalled();
    });
});
