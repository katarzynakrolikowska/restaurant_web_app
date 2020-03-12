import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish';
import {
    ERROR_REQUIRED_MESSAGE,
    ERROR_MISMATCH_MENU_ITEMS_MESSAGE,
    ERROR_PATTERN_MESSAGE,
    SUCCESS_UPDATE_MENU_MESSAGE,    ERROR_MIN_MESSAGE,
    ERROR_SERVER_MESSAGE
} from '../../user-messages/messages';
import { menuItemMatch } from '../../validators/menu-item.validator';
import { MenuService } from '../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { InputAutocompleteData } from '../../models/input-autocomplete-data';
import { SaveMenuItem } from '../../models/save-menu-item';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MenuItem } from '../../models/menu-item';
import { UpdateMenuItem } from '../../models/update-menu-item';



@Component({
  selector: 'app-admin-menu-form',
    templateUrl: './admin-menu-form.component.html',
    styleUrls: ['./admin-menu-form.component.css']
})
export class AdminMenuFormComponent implements OnInit, OnChanges {
    
    form: FormGroup;
    dishesFromService: Array<Dish>;
    dishesGroup: Array<InputAutocompleteData> = [];
    filteredDishesGroup: Array<InputAutocompleteData> = [];
    routeParam: string;
    dishesToSave: Array<Dish> = [];

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
        
        this.dishService.getDishes()
            .subscribe(dishes => {
                this.dishesFromService = dishes as Array<Dish>;
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

    filterDishes() {
        this.filteredDishesGroup = this.dishesGroup;
        if (this.dish.value)
            this.filteredDishesGroup = this.filterGroup(this.dish.value);
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

    getDishErrorMessage() {
        return this.dish.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.dish.hasError('mismatch') ? ERROR_MISMATCH_MENU_ITEMS_MESSAGE :
            this.dish.hasError('dishesEmpty') ? ERROR_REQUIRED_MESSAGE :
            '';
    }

    getPriceErrorMessage() {
        return this.price.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.price.hasError('min') ? ERROR_MIN_MESSAGE + '0' :
                '';
    }

    getAvailableErrorMessage() {
        return this.available.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.available.hasError('min') ? ERROR_PATTERN_MESSAGE:
                '';
    }

    addDishToSaveList(selectedDish: Dish) {
        if (this.routeParam === 'item')
            return;

        this.dishesToSave.push(selectedDish);
        this.dish.setValue('');

        this.filteredDishesGroup = this.dishesGroup;
    }
    
    updateDishesToSave(dishes: Array<Dish>) {
        this.dishesToSave = dishes;
        if (this.dishesToSave.length === 0)
            this.dish.setErrors({ dishesEmpty: true });
    }

    getSelectedDishName(dish: Dish) {
        return dish ? `${dish.name} - ${dish.amount} szt.` : '';
    }

    onSave() {     
        if (this.form.invalid)
            return;

        !this.mainMenuItemToUpdate ? this.saveItem() : this.updateItem();

        this.filteredDishesGroup = this.dishesGroup;
    }

    private saveItem() {
        let item: SaveMenuItem = {
            dishes: this.getIdsOfDishesToSave(),
            price: this.price.value,
            available: this.available.value,
            isMain: this.routeParam === 'mainitem'
        };

        this.menuService.create(item)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.router.navigate(['menu']);
            }, (errorResponse: HttpErrorResponse) => {
                if (errorResponse.error === 'Zestaw dnia już istnieje') {
                    this.toastr.error(errorResponse.error);
                    this.router.navigate(['menu']);
                } else
                    this.toastr.error(ERROR_SERVER_MESSAGE);
            });
    }

    private updateItem() {
        let item: UpdateMenuItem = {
            dishes: this.getIdsOfDishesToSave(),
            price: this.price.value,
            available: this.available.value
        };

        this.menuService.updateItem(this.mainMenuItemToUpdate.id, item)
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
        let group = {};

        this.dishesFromService.forEach(dish => {
            group[dish.category.name] = group[dish.category.name] || [];
            group[dish.category.name]
                .push({ id: dish.id, name: dish.name, amount: dish.amount });
        });

        for (let [key, value] of Object.entries(group)) {
            let dishes = value as Array<Dish>;
            dishes.sort((a, b) => a.name.localeCompare(b.name));

            let data: InputAutocompleteData = {
                categoryName: key,
                dishes: dishes
            };

            this.dishesGroup.push(data);
        }
    }

    private getIdsOfDishesToSave() {
        let ids: Array<number> = [];
        if (this.routeParam === 'mainitem') 
            this.dishesToSave.forEach(d => ids.push(d.id));

        return this.routeParam === 'item' ? [this.dish.value.id] : ids;
    }

    private setDishValidators() {
        this.routeParam === 'item' ?
            this.dish.setValidators([Validators.required, menuItemMatch(this.dishesFromService)]) : 
            this.dish.setValidators(menuItemMatch(this.dishesFromService));
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



