import { CartItem } from "./cart-item";

export interface Cart {
  id: number,
  items: CartItem[],
  userId?: number
}

export function getCartSum(cart: Cart) {
  return cart.items.reduce((previousValue, currentValue) => 
    previousValue += currentValue.menuItem.price * currentValue.amount, 0);
}