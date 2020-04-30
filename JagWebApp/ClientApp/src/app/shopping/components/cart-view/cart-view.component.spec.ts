import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { CartService } from 'shared/services/cart.service';
import { cartStubWithOneMenuItem } from 'shared/test/stubs/cart.stub';
import { CartViewComponent } from './cart-view.component';

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
            providers: [{ provide: 'BASE_URL', useValue: baseURL }],
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
        let id: number;
        let spy = spyOn(cartService, 'delete').and.returnValue(of(Object));
        spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));
        component.ngOnInit();
        fixture.detectChanges();
        id = component.cart.id;

        component.clearCart();

        expect(spy).toHaveBeenCalledWith(id);
        expect(component.cart).toBeNull();
    });
});
