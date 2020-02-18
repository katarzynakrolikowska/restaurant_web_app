import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartItemsService } from '../services/cart-items.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { cartStub } from '../test/stubs/cart-stub';
import { CartActionButtonsComponent } from './cart-action-buttons.component';

describe('CartActionButtonsComponent', () => {
    const baseURL = '';
    let component: CartActionButtonsComponent;
    let fixture: ComponentFixture<CartActionButtonsComponent>;
    let cartService: CartService;
    let cartItemSharedService: CartItemsSharedService;
    let cartItemService: CartItemsService;

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
        component.menuItemId = 1;
        component.menuItemQuantity = 1;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create cart if cart does not exist', () => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        let spyCartService = spyOn(cartService, 'create').and.returnValue(of(cartStub));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

        component.addItemToCart();

        expect(component.menuItemQuantity).toBe(2);
        expect(spyCartService).toHaveBeenCalledWith(component.menuItemId);
        expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
    });

    it('should create cart item if cart exists', () => {
        spyOn(localStorage, 'getItem').and.returnValue('2');
        let spyCartItemService = spyOn(cartItemService, 'createOrUpdate').and.returnValue(of(cartStub));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

        component.addItemToCart();

        expect(component.menuItemQuantity).toBe(2);
        expect(spyCartItemService).toHaveBeenCalledWith(component.menuItemId);
        expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
    });

    it('should remove item from cart when removeItemFromCart is called', () => {
        let spyCartItemService = spyOn(cartItemService, 'delete').and.returnValue(of(cartStub));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

        component.removeItemFromCart();

        expect(component.menuItemQuantity).toBe(0);
        expect(spyCartItemService).toHaveBeenCalledWith(component.menuItemId);
        expect(spyCartItemSharedService).toHaveBeenCalledWith(false);
    });

    it('should remove cart when cartItemService returns nothing', () => {
        spyOn(cartItemService, 'delete').and.returnValue(of(null));
        spyOn(cartItemSharedService, 'shareCartItemAdded');
        let spy = spyOn(localStorage, 'removeItem');

        component.removeItemFromCart();

        expect(component.menuItemQuantity).toBe(0);
        expect(spy).toHaveBeenCalledWith('cartId');
    });
});
