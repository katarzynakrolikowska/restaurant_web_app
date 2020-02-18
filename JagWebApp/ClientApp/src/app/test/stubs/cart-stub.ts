import { Cart } from "../../models/cart";
import { mainMenuItemStubWithOneDish } from "./main-menu-item.stub";

export const cartStub: Cart = {
    id: 1,
    items: [
        { menuItem: mainMenuItemStubWithOneDish, amount: 1 }
    ]
}
