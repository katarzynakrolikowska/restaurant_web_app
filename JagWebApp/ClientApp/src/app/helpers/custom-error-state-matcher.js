"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomErrorStateMatcher = /** @class */ (function () {
    function CustomErrorStateMatcher() {
    }
    CustomErrorStateMatcher.prototype.isErrorState = function (control, form) {
        return !!(control && control.invalid && (control.dirty || control.touched));
    };
    return CustomErrorStateMatcher;
}());
exports.CustomErrorStateMatcher = CustomErrorStateMatcher;
//# sourceMappingURL=custom-error-state-matcher.js.map