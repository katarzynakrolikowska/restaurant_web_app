import { Cart } from "../../models/cart";
import { menuItemStubWithOneDish, menuItemStubWithTwoDishes } from "./menu-item.stub";

export const cartStubWithOneItem: Cart = {
    id: 1,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 1 }
    ]
}

export const cartStubWithTwoItems: Cart = {
    id: 1,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 2 }
    ]
}

export const cartSubWithDifferentItems: Cart = {
    id: 2,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 1 },
        { menuItem: menuItemStubWithTwoDishes, amount: 1 },
    ]
}
