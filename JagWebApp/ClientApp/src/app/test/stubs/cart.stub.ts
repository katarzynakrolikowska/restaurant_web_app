import { Cart } from "../../models/cart";
import { menuItemStubWithOneDish } from "./menu-item.stub";

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
