import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ERROR_REQUIRED_MESSAGE, ERROR_PATTERN_MESSAGE, ERROR_MIN_MESSAGE } from '../../user-messages/messages';

@Component({
  selector: 'app-dialog-edit-menu-item',
  templateUrl: './dialog-edit-menu-item.component.html',
  styleUrls: ['./dialog-edit-menu-item.component.css']
})
export class DialogEditMenuItemComponent implements OnInit {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DialogEditMenuItemComponent>,
        @Inject(MAT_DIALOG_DATA) public data) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            price: new FormControl(this.data.price, [Validators.required, Validators.min(0)]),
            available: new FormControl(this.data.available, [Validators.required, Validators.min(0)])
        })
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    get price() {
        return this.form.get('price');
    }

    get available() {
        return this.form.get('available');
    }

    getPriceErrorMessage() {
        return this.price.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.price.hasError('min') ? ERROR_MIN_MESSAGE + '0' :
                '';
    }

    getAvailableErrorMessage() {
        return this.available.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.available.hasError('min') ? ERROR_MIN_MESSAGE :
                '';
    }
}
