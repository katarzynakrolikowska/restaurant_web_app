import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CartViewComponent } from './cart-view.component';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { of } from 'rxjs';
import { cartStubWithOneMenuItem } from '../test/stubs/cart.stub';

describe('CartViewComponent', () => {
    const baseURL = '';

    let component: CartViewComponent;
    let fixture: ComponentFixture<CartViewComponent>;
    let cartService: CartService;
    let cartItemSharedService: CartItemsSharedService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CartViewComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CartViewComponent);
        component = fixture.componentInstance;
        cartService = TestBed.get(CartService);
        cartItemSharedService = TestBed.get(CartItemsSharedService);
        component.subscription = cartItemSharedService.cartContent$.subscribe();

    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should clear cart when clearCart is called', () => {
        let spy = spyOn(cartService, 'delete').and.returnValue(of(Object));
        spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));
        component.ngOnInit();
        fixture.detectChanges();
        let id = component.cart.id;


        component.clearCart();

        expect(spy).toHaveBeenCalledWith(id);
        expect(component.cart).toBeNull();
    });

});
