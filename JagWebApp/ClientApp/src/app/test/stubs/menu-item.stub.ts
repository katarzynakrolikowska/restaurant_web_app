import { MenuItem } from "../../models/menu-item";

export const menuItemStubWithOneDish: MenuItem = {
    id: 1,
    dishes: [
        {
            name: 'a',
            category: {
                id: 1,
                name: 'b'
            },
            amount: 1
        }
    ],
    price: 1,
    limit: 1,
    available: 1,
    isMain: false
};


export const menuItemStubWithTwoDishes: MenuItem = {
    id: 2,
    dishes: [
        {
            name: 'a',
            category: {
                id: 1,
                name: 'b'
            },
            amount: 1
        },
        {
            name: 'c',
            category: {
                id: 2,
                name: 'd'
            },
            amount: 1
        }
    ],
    price: 1,
    limit: 1,
    available: 1,
    isMain: true
};
