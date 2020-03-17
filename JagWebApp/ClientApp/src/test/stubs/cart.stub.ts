import { menuItemStubWithOneDish, menuItemStubWithTwoDishes } from "./menu-item.stub";
import { Cart } from "../../app/models/cart";

export const cartStubWithOneMenuItem: Cart = {
    id: 1,
    items: [
        { menuItem: menuItemStubWithOneDish, amount: 1 }
    ]
}

export const cartStubWithTwoMenuItems: Cart = {
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
