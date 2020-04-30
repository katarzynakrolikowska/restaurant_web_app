"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var menu_item_stub_1 = require("./menu-item.stub");
exports.cartStubWithOneMenuItem = {
    id: 1,
    items: [
        { menuItem: menu_item_stub_1.menuItemStubWithOneDish, amount: 1 }
    ]
};
exports.cartStubWithTwoMenuItems = {
    id: 1,
    items: [
        { menuItem: menu_item_stub_1.menuItemStubWithOneDish, amount: 2 }
    ]
};
exports.cartSubWithDifferentItems = {
    id: 2,
    items: [
        { menuItem: menu_item_stub_1.menuItemStubWithOneDish, amount: 1 },
        { menuItem: menu_item_stub_1.menuItemStubWithTwoDishes, amount: 1 },
    ]
};
//# sourceMappingURL=cart.stub.js.map