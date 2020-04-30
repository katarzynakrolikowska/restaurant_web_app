import { Dish } from "shared/models/dish";

export interface InputAutocompleteData {
    categoryName: string;
    dishes: Array<Dish>;
}