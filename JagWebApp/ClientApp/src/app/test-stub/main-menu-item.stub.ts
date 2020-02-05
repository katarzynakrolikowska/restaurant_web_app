import { MainMenuItem } from "../models/main-menu-item";

export const mainMenuItemStubWithOneDish: MainMenuItem = {
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
    available: 1
};


export const mainMenuItemStubWithTwoDishes: MainMenuItem = {
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
    available: 1
};
