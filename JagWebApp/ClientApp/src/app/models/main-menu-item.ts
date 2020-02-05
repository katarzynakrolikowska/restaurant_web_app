import { Dish } from "./dish";

export interface MainMenuItem {
    id?: number;
    dishes: Array<Dish>,
    price: number;
    limit: number;
    available: number;
}
