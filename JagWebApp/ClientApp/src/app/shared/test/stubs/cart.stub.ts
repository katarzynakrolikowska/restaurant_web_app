import { Cart } from "shared/models/cart";
import { menuItemStubWithOneDish, menuItemStubWithTwoDishes } from "./menu-item.stub";

export const cartStubWithOneMenuItem: Cart = {
    id: 1,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 1 }
    ],
    sum: 1
}

export const cartStubWithTwoMenuItems: Cart = {
    id: 1,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 2 }
    ],
    sum: 1
}

export const cartSubWithDifferentItems: Cart = {
    id: 2,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 1 },
        { menuItem: menuItemStubWithTwoDishes, amount: 1 },
    ],
    sum: 2
}
