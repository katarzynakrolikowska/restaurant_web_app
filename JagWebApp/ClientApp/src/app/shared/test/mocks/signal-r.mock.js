"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mockSignalRService(signalRService, component) {
    signalRService.startConnection = function () { };
    signalRService.addTransferUpdatedItemListener = function () { };
    signalRService.addTransferDeletedItemListener = function () { };
    component.subscription = signalRService.onUpdatedItemReceived.subscribe();
    component.subscription.add(signalRService.onDeletedItemReceived.subscribe());
}
exports.mockSignalRService = mockSignalRService;
//# sourceMappingURL=signal-r.mock.js.map