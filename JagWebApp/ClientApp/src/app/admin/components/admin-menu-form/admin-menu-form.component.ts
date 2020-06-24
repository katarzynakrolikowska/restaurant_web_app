import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Dish } from 'shared/models/dish';
import { MenuItem } from 'shared/models/menu-item';
import { UpdateMenuItem } from 'shared/models/update-menu-item';
import { MenuService } from 'shared/services/menu.service';
import { ERROR_MIN_MESSAGE, ERROR_MISMATCH_MENU_ITEMS_MESSAGE, ERROR_PATTERN_MESSAGE, ERROR_REQUIRED_MESSAGE, ERROR_SERVER_MESSAGE, SUCCESS_UPDATE_MENU_MESSAGE } from 'src/app/shared/consts/user-messages.consts';
import { InputAutocompleteData } from '../../models/input-autocomplete-data';
import { SaveMenuItem } from '../../models/save-menu-item';
import { DishService } from '../../services/dish.service';
import { menuItemMatch } from '../../validators/menu-item.validator';


@Component({
  selector: 'app-admin-menu-form',
  templateUrl: './admin-menu-form.component.html',
  styleUrls: []
})
export class AdminMenuFormComponent implements OnInit, OnChanges {

  form: FormGroup;
  dishesFromService: Dish[] = [];
  dishesGroup: InputAutocompleteData[] = [];
  filteredDishesGroup: InputAutocompleteData[] = [];
  routeParam: string;
  dishesToSave: Dish[] = [];

  @Input('main-menu-item-to-update') mainMenuItemToUpdate: MenuItem;
  @Input('is-updating') isUpdating: boolean;

  constructor(
    private dishService: DishService,
    private menuService: MenuService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.routeParam = this.route.snapshot.params['item'];
    if (this.routeParam !== 'item' && this.routeParam !== 'mainitem') {
      router.navigate(['menu']);
    }
  }

  ngOnInit() {
    this.initForm();
    
    this.dishService.getAll()
      .subscribe(dishes => {
        this.dishesFromService = dishes as Dish[];
        this.setDishValidators();
        this.setDishesGroup();

        this.filteredDishesGroup = this.dishesGroup = this.dishesGroup.sort((a, b) =>
          a.categoryName.localeCompare(b.categoryName));
      });
  }

  ngOnChanges(): void {
    if (this.mainMenuItemToUpdate) {
      this.dishesToSave = this.mainMenuItemToUpdate.dishes;
      this.setFormValues();
    }
  }

  get dish() {
    return this.form.get('dish');
  }

  get price() {
    return this.form.get('price');
  }

  get available() {
    return this.form.get('available');
  }

  filterDishes() {
    this.filteredDishesGroup = this.dishesGroup;
    if (this.dish.value)
      this.filteredDishesGroup = this.filterGroup(this.dish.value);
  }

  getDishErrorMessage() {
    return this.dish.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.dish.hasError('mismatch') 
        ? ERROR_MISMATCH_MENU_ITEMS_MESSAGE
        : this.dish.hasError('dishesEmpty') 
          ? ERROR_REQUIRED_MESSAGE 
          : '';
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
        ? ERROR_PATTERN_MESSAGE
        : '';
  }

  addDishToSaveList(selectedDish: Dish) {
    if (this.routeParam === 'item')
      return;

    this.dishesToSave.push(selectedDish);
    this.dish.setValue('');

    this.filteredDishesGroup = this.dishesGroup;
  }
  
  updateDishesToSave(dishes: Dish[]) {
    this.dishesToSave = dishes;
    if (this.dishesToSave.length === 0)
      this.dish.setErrors({ dishesEmpty: true });
  }

  getSelectedDishName(dish: Dish) {
    return dish ? `${dish.name} - ${dish.amount} szt.` : '';
  }

  save() {
    if (this.form.invalid)
      return;

    !this.mainMenuItemToUpdate ? this.saveItem() : this.updateItem();

    this.filteredDishesGroup = this.dishesGroup;
  }

  private saveItem() {
    const item: SaveMenuItem = {
      dishes: this.getIdsOfDishesToSave(),
      price: this.price.value,
      available: this.available.value,
      isMain: this.routeParam === 'mainitem'
    };

    this.menuService.create(item)
      .subscribe(
        () => {
          this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
          this.router.navigate(['menu']);
        }, 
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.error === 'Zestaw dnia już istnieje') {
            this.toastr.error(errorResponse.error);
            this.router.navigate(['menu']);
          } 
          else
            this.toastr.error(ERROR_SERVER_MESSAGE);
        }
      );
  }

  private updateItem() {
    const item: UpdateMenuItem = {
      dishes: this.getIdsOfDishesToSave(),
      price: this.price.value,
      available: this.available.value
    };

    this.menuService.update(this.mainMenuItemToUpdate.id, item)
      .subscribe(() => {
        this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
        this.router.navigate(['menu']);
      });
  }

  private filterGroup(value: string): InputAutocompleteData[] {
    if (value) {
      return this.filteredDishesGroup
        .map(group => ({ categoryName: group.categoryName, dishes: this.filter(group.dishes, value) }))
        .filter(group => group.dishes.length > 0);
    }
  }

  private filter = (opt: Dish[], value: string): Dish[] => {
    const filterValue = value.toLowerCase();

    return opt.filter(item => item.name.toLowerCase().includes(filterValue));
  };

  private setDishesGroup() {
    const group = {};

    this.dishesFromService.forEach(dish => {
      group[dish.category.name] = group[dish.category.name] || [];
      group[dish.category.name]
        .push({ id: dish.id, name: dish.name, amount: dish.amount });
    });

    for (let [key, value] of Object.entries(group)) {
      const dishes = value as Dish[];
      dishes.sort((a, b) => a.name.localeCompare(b.name));

      const data: InputAutocompleteData = {
        categoryName: key,
        dishes: dishes
      };

      this.dishesGroup.push(data);
    }
  }

  private getIdsOfDishesToSave() {
    const ids: number[] = [];

    if (this.routeParam === 'mainitem') 
      this.dishesToSave.forEach(d => ids.push(d.id));

    return this.routeParam === 'item' ? [this.dish.value.id] : ids;
  }

  private setDishValidators() {
    this.routeParam === 'item' 
      ? this.dish.setValidators([Validators.required, menuItemMatch(this.dishesFromService)]) 
      : this.dish.setValidators(menuItemMatch(this.dishesFromService));
  }

  private initForm() {
    this.form = new FormGroup({
      dish: new FormControl(''),
      price: new FormControl('', [Validators.required, Validators.min(0.01)]),
      available: new FormControl('', [Validators.required, Validators.min(0)])
    });

    if (!this.isUpdating)
      this.dish.setValidators(Validators.required);
  }

  private setFormValues() {
    this.price.setValue(this.mainMenuItemToUpdate.price);
    this.available.setValue(this.mainMenuItemToUpdate.available);
  }
}