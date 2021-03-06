import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ERROR_MIN_MESSAGE, ERROR_REQUIRED_MESSAGE } from 'src/app/shared/consts/user-messages.consts';

@Component({
  selector: 'app-admin-ordinary-item-edit-dialog',
  templateUrl: './admin-ordinary-item-edit-dialog.component.html',
  styleUrls: ['./admin-ordinary-item-edit-dialog.component.css']
})
export class AdminOrdinaryItemEditDialogComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AdminOrdinaryItemEditDialogComponent>,
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
    return this.form.get("available");
  }

  getPriceErrorMessage() {
    return this.price.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.price.hasError('min') 
        ? ERROR_MIN_MESSAGE + '0' 
        : '';
  }

  getAvailableErrorMessage() {
    return this.available.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.available.hasError('min') 
        ? ERROR_MIN_MESSAGE 
        : '';
  }
}
