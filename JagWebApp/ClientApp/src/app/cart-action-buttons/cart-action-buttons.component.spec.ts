import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { cartStubWithOneMenuItem, cartStubWithTwoMenuItems } from '../../test/stubs/cart.stub';
import { AuthService } from '../services/auth.service';
import { CartItemsSharedService } from '../services/cart-items-shared.service';
import { CartService } from '../services/cart.service';
import { cartSubWithDifferentItems } from './../../test/stubs/cart.stub';
import { CartActionButtonsComponent } from './cart-action-buttons.component';


describe('CartActionButtonsComponent', () => {
  const baseURL = '';
  let component: CartActionButtonsComponent;
  let fixture: ComponentFixture<CartActionButtonsComponent>;
  let cartService: CartService;
  let cartItemSharedService: CartItemsSharedService;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartActionButtonsComponent],
      imports: [HttpClientModule],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartActionButtonsComponent);
    component = fixture.componentInstance;
    cartService = TestBed.get(CartService);
    cartItemSharedService = TestBed.get(CartItemsSharedService);
    authService = TestBed.get(AuthService);
    component.subscription = cartItemSharedService.cartContent$.subscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create cart if cart does not exist and ', () => {
    setUpInitialCart(null, 1);
    let spyCartService = spyOn(cartService, 'create').and.returnValue(of(cartStubWithOneMenuItem));
    let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

    fixture.detectChanges();
    component.addItemToCart();

    expect(component.menuItemQuantity).toBe(1);
    expect(spyCartService).toHaveBeenCalledWith({ menuItemId: component.menuItemId });
    expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
  });

  it('should increase amount of menu item by one if addItemToCart is called and cart contains menu item', () => {
    setUpInitialCart(cartStubWithOneMenuItem, 1);
    let spyCartService = spyOn(cartService, 'update').and.returnValue(of(cartStubWithTwoMenuItems));
    let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

    fixture.detectChanges();
    component.addItemToCart();

    expect(component.menuItemQuantity).toBe(2);
    expect(spyCartService).toHaveBeenCalled();
    expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
  });

  it('should add new menu item to cart if addItemToCart is called and cart does not contain that menu item', () => {
    setUpInitialCart(cartStubWithOneMenuItem, 2);
    let spyCartService = spyOn(cartService, 'update').and.returnValue(of(cartSubWithDifferentItems));
    let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

    fixture.detectChanges();
    component.addItemToCart();

    expect(component.cart.items.length).toBe(2);
    expect(spyCartService).toHaveBeenCalled();
    expect(spyCartItemSharedService).toHaveBeenCalledWith(true);
  });

  it('should decrease amount of menu item by one if removeItemFromCart is called and menuItemQuantity is greater than one', () => {
    setUpInitialCart(cartStubWithTwoMenuItems, 1);
    let spyCartService = spyOn(cartService, 'update').and.returnValue(of(cartStubWithOneMenuItem));
    let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

    fixture.detectChanges();
    component.removeItemFromCart();

    expect(component.menuItemQuantity).toBe(1);
    expect(spyCartService).toHaveBeenCalled();
    expect(spyCartItemSharedService).toHaveBeenCalledWith(false);
  });

  it('should remove item from cart if removeItemFromCart is called and menuItemQuantity is equal to one', () => {
    setUpInitialCart(cartSubWithDifferentItems, 1);
    let spyCartService = spyOn(cartService, 'update').and.returnValue(of(cartStubWithOneMenuItem));
    let spyCartItemSharedService = spyOn(cartItemSharedService, 'shareCartItemAdded');

    fixture.detectChanges();
    component.removeItemFromCart();

    expect(component.menuItemQuantity).toBe(0);
    expect(component.cart.items.length).toBe(1);
    expect(spyCartService).toHaveBeenCalled();
    expect(spyCartItemSharedService).toHaveBeenCalledWith(false);
  });

  function setUpInitialCart(initialCart, menuItemId) {
    component.menuItemId = menuItemId;
    spyOnProperty(cartItemSharedService, 'cartContent$').and.returnValue(of(initialCart));
    spyOn(authService, 'getUserId').and.returnValue(null);
  }
});
