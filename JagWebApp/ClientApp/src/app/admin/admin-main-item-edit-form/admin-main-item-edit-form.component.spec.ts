import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMainItemEditFormComponent } from './admin-main-item-edit-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlankComponent } from '../../test/blank/blank.component';
import { activatedRouteStub } from '../../test/stubs/activated-route.stub';
import { ActivatedRoute } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { of, throwError } from 'rxjs';
import { menuItemStubWithTwoDishes } from '../../test/stubs/menu-item.stub';

describe('AdminMainItemEditFormComponent', () => {
    const baseURL = '';
    let component: AdminMainItemEditFormComponent;
    let fixture: ComponentFixture<AdminMainItemEditFormComponent>;
    let menuService: MenuService;

      beforeEach(async(() => {
          TestBed.configureTestingModule({
              declarations: [AdminMainItemEditFormComponent, BlankComponent],
            imports: [
                HttpClientModule, ToastrModule.forRoot(),
                BrowserAnimationsModule, RouterTestingModule.withRoutes([
                    { path: 'menu', component: BlankComponent }
                ])
            ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },
                { provide: ActivatedRoute, useValue: activatedRouteStub }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminMainItemEditFormComponent);
        component = fixture.componentInstance;
        menuService = TestBed.get(MenuService);
    });

    it('should create', () => {
        spyOnMenuServiceToReturnMenuItem(of(menuItemStubWithTwoDishes));

        expect(component).toBeTruthy();
    });

    it('should init main menu item', () => {
        spyOnMenuServiceToReturnMenuItem(of(menuItemStubWithTwoDishes));

        expect(component.mainMenuItemToUpdate.price).toBe(1);
    });

    it('should NOT init main menu item when service returns error', () => {
        spyOnMenuServiceToReturnMenuItem(throwError(new Error('error')));

        expect(component.mainMenuItemToUpdate).toBe(undefined);
    });

    function spyOnMenuServiceToReturnMenuItem(valueToReturn) {
        spyOn(menuService, 'getMenuItem').and.returnValue(valueToReturn);

        component.ngOnInit();
        fixture.detectChanges();
    }
});
