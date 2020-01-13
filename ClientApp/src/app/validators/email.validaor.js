"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var EmailValidators = /** @class */ (function () {
    function EmailValidators() {
    }
    EmailValidators.shouldBeUnique = function (authService) {
        return function (control) {
            if (control.value) {
                return authService.userExists(control.value)
                    .pipe(operators_1.map(function (result) {
                    if (authService.loggedIn() && control.value === authService.getUserEmail())
                        return null;
                    return result ? { shouldBeUnique: true } : null;
                }));
            }
            ;
        };
    };
    return EmailValidators;
}());
exports.EmailValidators = EmailValidators;
//# sourceMappingURL=email.validaor.js.map