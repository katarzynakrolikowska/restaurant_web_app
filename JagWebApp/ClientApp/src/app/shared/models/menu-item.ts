import { Dish } from "./dish";

export interface MenuItem {
  id?: number;
  dishes: Array<Dish>,
  price: number;
  ordered?: number;
  available: number;
  isMain?: boolean;
}