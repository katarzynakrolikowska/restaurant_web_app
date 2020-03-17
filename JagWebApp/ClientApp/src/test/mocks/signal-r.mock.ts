import { SignalRService } from "../../app/services/signal-r.service";

export function mockSignalRService(signalRService: SignalRService, component) {
    (signalRService as any).startConnection = () => { };
    (signalRService as any).addTransferUpdatedItemListener = () => { };
    (signalRService as any).addTransferDeletedItemListener = () => { };

    component.subscription = signalRService.onUpdatedItemReceived.subscribe();
    component.subscription.add(signalRService.onDeletedItemReceived.subscribe());
}
