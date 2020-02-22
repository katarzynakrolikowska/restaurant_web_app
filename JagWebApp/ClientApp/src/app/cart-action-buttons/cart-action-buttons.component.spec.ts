import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartItemsService } from '../services/cart-items.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { cartStubWithOneItem, cartStubWithTwoItems } from '../test/stubs/cart.stub';
import { CartActionButtonsComponent } from './cart-action-buttons.component';
import { AuthService } from '../services/auth.service';
import { CART_ID } from '../consts/app-consts';


describe('CartActionButtonsComponent', () => {
    const baseURL = '';
    let component: CartActionButtonsComponent;
    let fixture: ComponentFixture<CartActionButtonsComponent>;
    let cartService: CartService;
    let cartItemSharedService: CartItemsSharedService;
    let cartItemService: CartItemsService;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CartActionButtonsComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CartActionButtonsComponent);
        component = fixture.componentInstance;
        cartService = TestBed.get(CartService);
        cartItemSharedService = TestBed.get(CartItemsSharedService);
        cartItemService = TestBed.get(CartItemsService);
        authService = TestBed.get(AuthService);
        component.subscription = cartItemSharedService.cartContent$.subscribe();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create cart if cart does not exist and ', () => {
        setUpWhenInitialCart(null);
        let spyCartService = spyOn(cartService, 'create').and.returnValue(of(cartStubWithOneItem));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

        fixture.detectChanges();
        component.addItemToCart();

        expect(component.menuItemQuantity).toBe(1);
        expect(spyCartService).toHaveBeenCalledWith({ menuItemId: component.menuItemId });
        expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
    });

    it('should create cart item if cart exists', () => {
        setUpWhenInitialCart(cartStubWithOneItem);
        let spyCartItemService = spyOn(cartItemService, 'createOrUpdate').and.returnValue(of(cartStubWithTwoItems));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

        fixture.detectChanges();
        component.addItemToCart();

        expect(component.menuItemQuantity).toBe(2);
        expect(spyCartItemService).toHaveBeenCalledWith(component.menuItemId, component.cart.id);
        expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
    });

    it('should remove item from cart when removeItemFromCart is called', () => {
        setUpWhenInitialCart(cartStubWithTwoItems);
        let spyCartItemService = spyOn(cartItemService, 'delete').and.returnValue(of(cartStubWithOneItem));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

        fixture.detectChanges();
        component.removeItemFromCart();

        expect(component.menuItemQuantity).toBe(1);
        expect(spyCartItemService).toHaveBeenCalledWith(component.menuItemId, cartStubWithOneItem.id);
        expect(spyCartItemSharedService).toHaveBeenCalledWith(false);
    });

    it('should remove cart when cartItemService returns null', () => {
        setUpWhenInitialCart(cartStubWithOneItem);
        spyOn(cartItemService, 'delete').and.returnValue(of(null));
        spyOn(cartItemSharedService, 'shareCartItemAdded');
        let spy = spyOn(localStorage, 'removeItem');

        fixture.detectChanges();
        component.removeItemFromCart();

        expect(component.menuItemQuantity).toBe(0);
        expect(spy).toHaveBeenCalledWith(CART_ID);
    });

    function setUpWhenInitialCart(initialCart) {
        component.menuItemId = 1;
        spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(initialCart));
        spyOn(authService, 'getUserId').and.returnValue(null);
    }
});
