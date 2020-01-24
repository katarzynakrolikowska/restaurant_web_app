import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialog-cofirm',
  templateUrl: './dialog-cofirm.component.html',
  styleUrls: ['./dialog-cofirm.component.css']
})
export class DialogCofirmComponent {
    message: string;

    constructor(@Inject(MAT_DIALOG_DATA) public data: string) {
        this.message = data;
    }
}
