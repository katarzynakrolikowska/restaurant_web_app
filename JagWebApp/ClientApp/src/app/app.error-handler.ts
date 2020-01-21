import { ErrorHandler, Injectable, Injector, NgZone, isDevMode } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";


@Injectable()
export class AppErrorHandler implements ErrorHandler {
    private toastr: ToastrService;

    constructor(
        private injector: Injector,
        private ngZone: NgZone,
        private spinner: NgxSpinnerService
    ) { }

    handleError(error: any): void {
        this.ngZone.run(() => {
            this.spinner.hide();
            console.log(error);
            this.toastr = this.injector.get(ToastrService);
            this.toastr.error('Wystąpił nieoczekiwany błąd.');
        });

    }
}

