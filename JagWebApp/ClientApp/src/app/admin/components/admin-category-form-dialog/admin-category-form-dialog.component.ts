import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ERROR_REQUIRED_MESSAGE } from 'shared/consts/user-messages.consts';
import { notEmptyInput } from 'shared/validators/not-empty-input.validator';

@Component({
  selector: 'app-admin-category-form-dialog',
  templateUrl: './admin-category-form-dialog.component.html',
  styleUrls: []
})
export class AdminCategoryFormDialogComponent implements OnInit {
  form: FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<AdminCategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      category: new FormControl(this.data.category, [Validators.required, notEmptyInput()])
    })
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  get category() {
    return this.form.get('category');
  }

  getCategoryErrorMessage() {
    return this.category.hasError('required') || this.category.hasError('empty') ? ERROR_REQUIRED_MESSAGE :
        '';
  }
}
