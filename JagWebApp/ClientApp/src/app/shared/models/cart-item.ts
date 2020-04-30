import { MenuItem } from "./menu-item";

export interface CartItem {
  id?: number;
  menuItem: MenuItem;
  amount: number;
}