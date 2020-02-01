import { Dish } from "./dish";
import { Photo } from "./photo";

export interface MenuItem {
    id?: number;
    dish: Dish,
    limit: number;
    available: number;
    mainPhoto?: Photo;
}
