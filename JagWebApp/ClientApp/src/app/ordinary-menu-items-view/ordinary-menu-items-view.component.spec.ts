import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { OrdinaryMenuItemsViewComponent } from './ordinary-menu-items-view.component';
import { HttpClientModule } from '@angular/common/http';

describe('OrdinaryMenuItemsViewComponent', () => {
    const baseURL = '';

    let component: OrdinaryMenuItemsViewComponent;
    let fixture: ComponentFixture<OrdinaryMenuItemsViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OrdinaryMenuItemsViewComponent],
            imports: [RouterTestingModule.withRoutes([]), HttpClientModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OrdinaryMenuItemsViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should navigate to new menu item form when addDishToMenu is called', () => {
        let router = TestBed.get(Router);
        let spy = spyOn(router, 'navigate');

        component.addDishToMenu();

        expect(spy).toHaveBeenCalledWith(['admin/menu/item/new']);
    });
});
