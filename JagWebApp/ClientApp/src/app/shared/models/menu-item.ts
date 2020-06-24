import { Dish } from "./dish";

export interface MenuItem {
  id?: number;
  dishes: Dish[],
  price: number;
  ordered?: number;
  available: number;
  isMain?: boolean;
}