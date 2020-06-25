import { MenuItem } from "./menu-item";

export interface CartItem {
  id?: number;
  menuItem: MenuItem;
  amount: number;
}

export function getCartItemSum(cartItem: CartItem) {
  return cartItem.menuItem.price * cartItem.amount;
}