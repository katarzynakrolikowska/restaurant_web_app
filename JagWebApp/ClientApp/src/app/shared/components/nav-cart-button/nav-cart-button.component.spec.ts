import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CartItemsSharedService } from 'shared/services/cart-items-shared.service';
import { CartService } from 'shared/services/cart.service';
import { SignalRService } from 'shared/services/signal-r.service';
import { mockSignalRService } from 'shared/test/mocks/signal-r.mock';
import { cartStubWithOneMenuItem, cartSubWithDifferentItems } from 'shared/test/stubs/cart.stub';
import { NavCartButtonComponent } from './nav-cart-button.component';


describe('NavCartButtonComponent', () => {
  const baseURL = '';

  let component: NavCartButtonComponent;
  let fixture: ComponentFixture<NavCartButtonComponent>;
  let cartItemSharedService: CartItemsSharedService;
  let cartService: CartService;
  let spy;
  let signalRService: SignalRService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavCartButtonComponent],
      imports: [HttpClientModule],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavCartButtonComponent);
    component = fixture.componentInstance;
    cartItemSharedService = TestBed.get(CartItemsSharedService);
    cartService = TestBed.get(CartService);
    spyOnProperty(cartService, 'cartId').and.returnValue("1");
    spy = spyOn(cartService, 'getSingle').and.returnValue(of(cartStubWithOneMenuItem));

    component.userId = null;
    signalRService = TestBed.get(SignalRService);
    mockSignalRService(signalRService, component);

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
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.cartItemsQuantity).toBe(2);
  });

  it('should decrease cart items count by one when cartItemSharedService share info item is removed from cart', () => {
    spyOnProperty(cartItemSharedService, 'itemAddedContent$').and.returnValue(of(false));
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(cartStubWithOneMenuItem));

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.cartItemsQuantity).toBe(0);
  });

  it('should update user cart when user log in and cart is not empty', () => {
    component.userId = 1;
    let spy = spyOn(cartService, 'updateCartAfterLogin').and.returnValue(of(cartSubWithDifferentItems));
    let spyRemoveItem = spyOn(cartService, 'removeCartId');

    component.ngOnChanges();

    expect(spy).toHaveBeenCalled();
    expect(spyRemoveItem).toHaveBeenCalled();
    expect(component.cartItemsQuantity).toBe(2);
  });

  it('should init cart to user cart when user log in and cart is empty', () => {
    component.userId = 1;
    component.cartItemsQuantity = 0;
    let spy = spyOn(cartService, 'getUserCart').and.returnValue(of(cartSubWithDifferentItems));

    component.ngOnChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.cartItemsQuantity).toBe(2);
  });

  it('should clear cart when user log out', () => {
    component.userId = null;

    component.ngOnChanges();

    expect(component.cartItemsQuantity).toBe(0);
    expect(component.cart).toBeNull();
  });
});
