import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { ERROR_SERVER_MESSAGE } from 'shared/consts/user-messages.consts';
import { Category } from 'shared/models/category';
import { CategoryService } from 'shared/services/category.service';
import { AdminCategoryFormDialogComponent } from '../admin-category-form-dialog/admin-category-form-dialog.component';

@Component({
  selector: 'app-admin-dish-categories-view',
  templateUrl: './admin-dish-categories-view.component.html',
  styleUrls: []
})
export class AdminDishCategoriesViewComponent implements OnInit {
  categories: Array<Category> = [];

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe(categories => this.categories = categories);
  }

  openNewCategoryDialog(): void { 
    const dialogRef = this.dialog.open(
      AdminCategoryFormDialogComponent,
      { data: { title: 'Dodaj nową kategorię', category: ''} });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.categoryService.save(result.category)
          .subscribe(category => this.categories.push(category))
    });
  }

  openEditCategoryDialog(category: Category): void { 
    const dialogRef = this.dialog.open(
      AdminCategoryFormDialogComponent,
      { data: { title: 'Edytuj kategorię', category: category.name} });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        category.name = result.category;
        this.categoryService.update(category)
          .subscribe(() => this.categories.find(c => c.id === category.id).name = category.name);
      }
    });
  }

  removeCategory(id: number) {
    this.categoryService.remove(id)
      .subscribe(
        () => {
          let index = this.categories.findIndex(c => c.id === id);
          this.categories.splice(index, 1);
        },
        (errorResult: HttpErrorResponse) => {
          errorResult.error === 'Category is used' 
            ? this.toastr.error('Istnieje danie przypisane do tej kategorii')
            : this.toastr.error(ERROR_SERVER_MESSAGE);
        }
      )
  }
}
