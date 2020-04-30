"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dish_stub_1 = require("./dish.stub");
exports.menuItemStubWithOneDish = {
    id: 1,
    dishes: [dish_stub_1.dishStub],
    price: 1,
    available: 1,
    isMain: false
};
exports.menuItemStubWithTwoDishes = {
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
    available: 1,
    isMain: true
};
//# sourceMappingURL=menu-item.stub.js.map