import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { notEmptyInput } from 'src/app/validators/not-empty-input.validator';
import { ERROR_REQUIRED_MESSAGE } from 'src/app/consts/user-messages.consts';

@Component({
  selector: 'app-admin-category-form-dialog',
  templateUrl: './admin-category-form-dialog.component.html',
  styleUrls: ['./admin-category-form-dialog.component.css']
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
