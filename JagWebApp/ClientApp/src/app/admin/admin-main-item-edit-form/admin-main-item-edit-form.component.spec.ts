import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminMainItemEditFormComponent } from './admin-main-item-edit-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlankComponent } from '../../test/blank/blank.component';
import { activatedRouteStub } from '../../test/stubs/activated-route.stub';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { of, throwError, Scheduler } from 'rxjs';
import { mainMenuItemStubWithTwoDishes } from '../../test/stubs/main-menu-item.stub';
import { ERROR_SERVER_MESSAGE } from '../../user-messages/messages';

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
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init main menu item', () => {
        spyOn(menuService, 'getMenuItem').and.returnValue(of(mainMenuItemStubWithTwoDishes));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.mainMenuItemToUpdate.price).toBe(1);
    });

    it('should NOT init main menu item when service returns error', () => {
        spyOn(menuService, 'getMenuItem').and.returnValue(throwError(new Error('error')));

        expect(component.mainMenuItemToUpdate).toBe(undefined);
    });
});
