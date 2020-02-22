import { TestBed } from '@angular/core/testing';

import { CartItemsSharedService } from './cart-items-shared.service';

describe('CartItemsSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CartItemsSharedService = TestBed.get(CartItemsSharedService);
    expect(service).toBeTruthy();
  });
});
