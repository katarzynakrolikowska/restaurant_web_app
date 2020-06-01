import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ERROR_SERVER_MESSAGE } from "../consts/user-messages.consts";


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
      this.toastr = this.injector.get(ToastrService);
      
      this.toastr.error(ERROR_SERVER_MESSAGE);
    });
  }
}
