import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { DishService } from './../../services/dish.service';
import { MenuService } from './../../services/menu.service';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { MatDialog } from '@angular/material';
import { AdminCategoryFormDialogComponent } from '../admin-category-form-dialog/admin-category-form-dialog.component';
import { ERROR_SERVER_MESSAGE } from 'src/app/consts/user-messages.consts';

@Component({
  selector: 'app-admin-dish-categories-view',
  templateUrl: './admin-dish-categories-view.component.html',
  styleUrls: ['./admin-dish-categories-view.component.css']
})
export class AdminDishCategoriesViewComponent implements OnInit {
  categories: Array<Category> = [];

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.categoryService.getCategories()
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
