import { MenuItem } from "../models/menuItem";

export const menuItemStub: MenuItem = {
    id: 1,
    dish: {
        name: 'a',
        category: {
            id: 1,
            name: 'b'
        },
        price: 1,
        amount: 1
    },
    limit: 1,
    available: 1
};
