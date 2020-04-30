import { Dish } from "shared/models/dish";
import { photoStub } from "./photo.stub";

export const dishStub: Dish = {
    id: 1,
    name: 'a',
    categoryId: 1,
    category: {
        id: 1,
        name: 'b'
        },
    amount: 1,
    mainPhoto: photoStub
}
