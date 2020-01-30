"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function menuItemMatch(dishes) {
    return function (control) {
        console.log(control.value);
        console.log(dishes);
        if (dishes)
            return (control.value.name) ? null : { mismatch: true };
        //return dishes.includes(control.value) ? null : { mismatch: true };
    };
}
exports.menuItemMatch = menuItemMatch;
//# sourceMappingURL=menu-item.validator.js.map