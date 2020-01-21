"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function passwordsMatch(password) {
    return function (control) {
        if (password)
            return password.value === control.value ? null : { 'mismatch': true };
    };
    //static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
    //    return new Promise((resolve, reject) => {
    //        setTimeout(() => {
    //            if (control.value === '12')
    //                resolve({ shouldBeUnique: true });
    //            else
    //                resolve(null);
    //        }, 100);
    //    });
    //}
}
exports.passwordsMatch = passwordsMatch;
//# sourceMappingURL=password.validator.js.map