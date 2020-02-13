import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavCartButtonComponent } from './nav-cart-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartItemsService } from '../services/cart-items.service';
import { of } from 'rxjs';


describe('NavCartButtonComponent', () => {
    const baseURL = '';

    let component: NavCartButtonComponent;
    let fixture: ComponentFixture<NavCartButtonComponent>;
    let cartItemSharedService: CartItemsSharedService;
    let cartItemService: CartItemsService;
    let spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NavCartButtonComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NavCartButtonComponent);
        component = fixture.componentInstance;
        cartItemSharedService = TestBed.get(CartItemsSharedService);
        cartItemService = TestBed.get(CartItemsService);
        spyOn(localStorage, 'getItem').and.returnValue("1");
        spy = spyOn(cartItemService, 'getCartItemsCount').and.returnValue(of(2));

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init cart items count if cart exists', () => {
        expect(spy).toHaveBeenCalledWith("1");
        expect(component.cartItemsCount).toBe(2);
    });

    it('should increase cart items count by one when cartItemSharedService share info item is added to cart', () => {
        spyOnProperty(cartItemSharedService, 'itemsContent$').and.returnValue(of(true));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.cartItemsCount).toBe(3);
    });
});
