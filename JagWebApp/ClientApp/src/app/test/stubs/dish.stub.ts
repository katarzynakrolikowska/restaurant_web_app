import { Dish } from "../../models/dish";
import { photoStub } from "./photo.stub";

export const dishStub: Dish = {
    id: 1,
    name: 'a',
    category: {
        id: 1,
        name: 'b'
        },
    amount: 1,
    mainPhoto: photoStub
}
