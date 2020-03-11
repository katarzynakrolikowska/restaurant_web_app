"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function passwordsMatch(controlFirstPassword, controlSecondPassword) {
    return function () {
        if (controlFirstPassword && controlSecondPassword)
            return controlFirstPassword.value === controlSecondPassword.value ? null : { 'mismatch': true };
    };
}
exports.passwordsMatch = passwordsMatch;
//# sourceMappingURL=password.validator.js.map