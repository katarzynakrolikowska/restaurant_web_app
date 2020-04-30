import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from 'shared/components/dialog-confirm/dialog-confirm.component';
import { Dish } from 'shared/models/dish';
import { ERROR_SERVER_MESSAGE, SUCCESS_REMOVE_DISH_MESSAGE } from 'src/app/shared/consts/user-messages.consts';
import { DishService } from '../../services/dish.service';

@Component({
  selector: 'app-admin-dishes-view',
  templateUrl: './admin-dishes-view.component.html',
  styleUrls: ['./admin-dishes-view.component.css']
})
export class AdminDishesViewComponent implements OnInit {
  dishes: Array<Dish> = [];
  displayedColumns: string[] = ['no', 'name', 'category', 'amount', 'editing', 'deleting'];
  dataSource;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dishService: DishService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.dishService.getAll()
      .subscribe(dishes => {
        this.dishes = dishes;
        this.dataSource = new MatTableDataSource<Dish>(this.dishes);

        this.dataSource.filterPredicate = (data, filter: string) => {
          const accumulator = (currentTerm, key) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };

        this.dataSource.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'category': return item.category.name;
            default: return item[property];
          }
        };

        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.spinner.hide();
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) 
      this.dataSource.paginator.firstPage();
  }

  onEditClick(id) {
    this.router.navigate(['admin/dishes/edit/' + id]);
  }

  openConfirmingDialog(id: number): void {
    const dialogRef = this.dialog.open(
      DialogConfirmComponent,
      { data: 'Czy napewno chcesz usunąć wybrane danie?' });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.removeDish(id);
    });
  }

  private removeDish(id) {
    this.dishService.delete(id)
      .subscribe(() => {
        this.updateDishesTableAfterRemoving(id);
        this.toastr.success(SUCCESS_REMOVE_DISH_MESSAGE);
      }, (errorResponse: HttpErrorResponse) => 
        errorResponse.status === 400 && errorResponse.error.includes('Menu') ?
          this.toastr.error(errorResponse.error) : this.toastr.error(ERROR_SERVER_MESSAGE)
      );
  }

  private updateDishesTableAfterRemoving(removedDishId: number) {
    let index: number = this.dishes.findIndex(d => d.id === removedDishId);
    this.dishes.splice(index, 1);

    this.dataSource = new MatTableDataSource<Dish>(this.dishes);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  private nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) 
          search = this.nestedFilterCheck(search, data[key], k);
      }
    } else 
      search += data[key];
    
    return search;
  }
}
