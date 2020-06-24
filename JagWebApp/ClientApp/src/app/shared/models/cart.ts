import { CartItem } from "./cart-item";

export class Cart {

  constructor(public id: number, public items: CartItem[], public userId?: number) {}

  get sum() {
    return this.items.reduce((previousValue, currentValue) => 
      previousValue += currentValue.menuItem.price * currentValue.amount, 0);
  }
}