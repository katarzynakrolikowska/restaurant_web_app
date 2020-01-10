import { ErrorHandler, Injectable, Injector, NgZone, isDevMode } from "@angular/core";
import { ToastrService } from "ngx-toastr";


@Injectable()
export class AppErrorHandler implements ErrorHandler {
    private toastr: ToastrService;

    constructor(
        private injector: Injector,
        private ngZone: NgZone
    ) { }

    handleError(error: any): void {
        this.ngZone.run(() => {
            console.log(error);
            this.toastr = this.injector.get(ToastrService);
            this.toastr.error('Wystąpił nieoczekiwany błąd.');
        });

    }
}

