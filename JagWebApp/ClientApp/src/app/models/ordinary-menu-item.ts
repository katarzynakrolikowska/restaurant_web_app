import { Dish } from "./dish";

export interface OrdinaryMenuItem {
  id?: number;
  dish: Dish,
  price: number;
  available: number;
  ordered?: number;
}
