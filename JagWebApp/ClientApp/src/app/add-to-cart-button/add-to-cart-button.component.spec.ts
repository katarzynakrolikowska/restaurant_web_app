import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCartButtonComponent } from './add-to-cart-button.component';
import { HttpClientModule } from '@angular/common/http';
import { CartService } from '../services/cart.service';
import { of } from 'rxjs';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartItemsService } from '../services/cart-items.service';

describe('AddToCartButtonComponent', () => {
    const baseURL = '';
    let component: AddToCartButtonComponent;
    let fixture: ComponentFixture<AddToCartButtonComponent>;
    let cartService: CartService;
    let cartItemSharedService: CartItemsSharedService;
    let cartItemService: CartItemsService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AddToCartButtonComponent],
            imports: [HttpClientModule],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AddToCartButtonComponent);
        component = fixture.componentInstance;
        cartService = TestBed.get(CartService);
        cartItemSharedService = TestBed.get(CartItemsSharedService);
        cartItemService = TestBed.get(CartItemsService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create cart if cart does not exist', () => {
        component.menuItemId = 1;
        spyOn(localStorage, 'getItem').and.returnValue(null);

        let spyCartService = spyOn(cartService, 'create').and.returnValue(of(2));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItems');

        component.onClick();

        expect(spyCartService).toHaveBeenCalledWith({ menuItemId: component.menuItemId });
        expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
    });

    it('should create cart item if cart exists', () => {
        component.menuItemId = 1;
        spyOn(localStorage, 'getItem').and.returnValue('2');

        let spyCartItemService = spyOn(cartItemService, 'createOrUpdate').and.returnValue(of(Object));
        let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItems');

        component.onClick();

        expect(spyCartItemService).toHaveBeenCalledWith({ menuItemId: component.menuItemId, cartId: "2" });
        expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
    });
});
