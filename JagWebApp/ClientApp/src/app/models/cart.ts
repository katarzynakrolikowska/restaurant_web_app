import { CartItem } from "./cart-item";

export interface Cart {
  id: number;
  items: Array<CartItem>;
  userId?: number;
}
