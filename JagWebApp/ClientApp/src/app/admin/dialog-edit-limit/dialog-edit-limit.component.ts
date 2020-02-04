import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ERROR_REQUIRED_MESSAGE, ERROR_PATTERN_MESSAGE } from '../../user-messages/messages';

@Component({
  selector: 'app-dialog-edit-limit',
  templateUrl: './dialog-edit-limit.component.html',
  styleUrls: ['./dialog-edit-limit.component.css']
})
export class DialogEditLimitComponent implements OnInit {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<DialogEditLimitComponent>,
        @Inject(MAT_DIALOG_DATA) public limit: number) { }

    ngOnInit(): void {
        this.form = new FormGroup({
            limitControl: new FormControl(this.limit, [Validators.required, Validators.min(0)])
        })
    }

    onCloseClick(): void {
        this.dialogRef.close();
    }

    get limitControl() {
        return this.form.get('limitControl');
    }

    getLimitErrorMessage() {
        return this.limitControl.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.limitControl.hasError('min') ? ERROR_PATTERN_MESSAGE :
                '';
    }
}
