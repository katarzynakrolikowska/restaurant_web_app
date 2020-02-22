import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NavCartButtonComponent } from './nav-cart-button.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { of } from 'rxjs';
import { CartService } from '../services/cart.service';
import { cartStubWithOneItem } from '../test/stubs/cart.stub';
import { Cart } from '../models/cart';
import { menuItemStubWithOneDish, menuItemStubWithTwoDishes } from '../test/stubs/menu-item.stub';
import { CART_ID } from '../consts/app-consts';


describe('NavCartButtonComponent', () => {
    const baseURL = '';
    let cart: Cart = {
        id: 2,
        items: [
            { menuItem: menuItemStubWithOneDish, amount: 1 },
            { menuItem: menuItemStubWithTwoDishes, amount: 1 },
        ]
    }
    let component: NavCartButtonComponent;
    let fixture: ComponentFixture<NavCartButtonComponent>;
    let cartItemSharedService: CartItemsSharedService;
    let cartService: CartService;
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
        cartService = TestBed.get(CartService);
        spyOn(localStorage, 'getItem').and.returnValue("1");
        spy = spyOn(cartService, 'getCart').and.returnValue(of(cartStubWithOneItem));

        component.userId = null;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init cart if cart exists', () => {
        expect(spy).toHaveBeenCalled();
        expect(component.cartItemsQuantity).toBe(1);
    });

    it('should increase cart items count by one when cartItemSharedService share info item is added to cart', () => {
        spyOnProperty(cartItemSharedService, 'itemAddedContent$').and.returnValue(of(true));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.cartItemsQuantity).toBe(2);
    });

    it('should decrease cart items count by one when cartItemSharedService share info item is removed from cart', () => {
        spyOnProperty(cartItemSharedService, 'itemAddedContent$').and.returnValue(of(false));

        component.ngOnInit();
        fixture.detectChanges();

        expect(component.cartItemsQuantity).toBe(0);
    });

    it('should update user cart when user log in and cart is not empty', () => {
        component.userId = 1;
        let spy = spyOn(cartService, 'update').and.returnValue(of(cart));
        let spyLocalStorage = spyOn(localStorage, 'removeItem');

        component.ngOnChanges();

        expect(spy).toHaveBeenCalled();
        expect(spyLocalStorage).toHaveBeenCalledWith(CART_ID);
        expect(component.cartItemsQuantity).toBe(2);
    });

    it('should init cart to user cart when user log in and cart is empty', () => {
        component.userId = 1;
        component.cartItemsQuantity = 0;
        let spy = spyOn(cartService, 'getUserCart').and.returnValue(of(cart));

        component.ngOnChanges();

        expect(spy).toHaveBeenCalledWith(component.userId);
        expect(component.cartItemsQuantity).toBe(2);
    });

    it('should clear cart when user log out', () => {
        component.userId = null;

        component.ngOnChanges();

        expect(component.cartItemsQuantity).toBe(0);
        expect(component.cart).toBeNull();
    });
});
