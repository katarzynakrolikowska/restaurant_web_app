import { Dish } from "./dish";

export interface DataForAutocomplete {
    categoryName: string;
    dishes: Array<Dish>;
}
