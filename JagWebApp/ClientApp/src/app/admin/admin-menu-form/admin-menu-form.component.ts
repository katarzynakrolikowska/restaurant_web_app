import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish';
import {
    ERROR_REQUIRED_MESSAGE,
    ERROR_MISMATCH_MENU_ITEMS_MESSAGE,
    ERROR_PATTERN_MESSAGE,
    SUCCESS_UPDATE_MENU_MESSAGE,
    ERROR_MIN_MESSAGE,
    ERROR_SERVER_MESSAGE
} from '../../user-messages/messages';
import { menuItemMatch } from '../../validators/menu-item.validator';
import { MenuService } from '../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomErrorStateMatcher } from '../../helpers/custom-error-state-matcher';
import { InputAutocompleteData } from '../../models/input-autocomplete-data';
import { SaveMenuItem } from '../../models/save-menu-item';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-admin-menu-form',
    templateUrl: './admin-menu-form.component.html',
    styleUrls: ['./admin-menu-form.component.css']
})
export class AdminMenuFormComponent implements OnInit {
    form: FormGroup;
    dishesFromService: Array<Dish>;
    dishesGroup: Array<InputAutocompleteData> = [];
    filteredDishesGroup: Array<InputAutocompleteData> = [];
    routeParam: string;
    dishesToSave: Array<Dish> = [];


    constructor(
        private dishService: DishService,
        private menuService: MenuService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.routeParam = this.route.snapshot.params['item'];
        if (this.routeParam !== 'item' && this.routeParam !== 'mainitem') {
            router.navigate(['admin/menu']);
        }
    }

    ngOnInit() {
        this.initForm();

        this.dishService.getDishes()
            .subscribe(result => {
                let group = {};
                this.dishesFromService = result;

                this.setDishValidators();
                
                
                result.forEach(dish => {
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

                this.filteredDishesGroup = this.dishesGroup = this.dishesGroup.sort((a, b) =>
                    a.categoryName.localeCompare(b.categoryName));
            });
    }

    filterDishes() {
        this.filteredDishesGroup = this.dishesGroup;
        if (this.dish.value)
            this.filteredDishesGroup = this.filterGroup(this.dish.value);
    }

    get dish() {
        return this.form.get('dishId');
    }

    get price() {
        return this.form.get('price');
    }

    get limit() {
        return this.form.get('limit');
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

    getLimitErrorMessage() {
        return this.limit.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.limit.hasError('min') ? ERROR_PATTERN_MESSAGE:
                '';
    }

    addDishToSaveList(selectedDish: Dish) {
        if (this.routeParam === 'item')
            return;

        this.dishesToSave.push(selectedDish);
        this.dish.setValue('');

        this.filteredDishesGroup = this.dishesGroup;
    }

    removeDishFromSaveList(dishId) {
        let index = this.dishesToSave.findIndex(d => d.id === dishId);
        this.dishesToSave.splice(index, 1);

        if (this.dishesToSave.length === 0)
            this.dish.setErrors({ dishesEmpty: true });
    }

    onSave() {     
        if (this.form.invalid)
            return;

        let menuItem: SaveMenuItem = {
            dishes: this.getDishesToSave(),
            price: this.price.value,
            limit: this.limit.value,
            isMain: this.routeParam === 'mainitem'
        };

        this.menuService.create(menuItem)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.router.navigate(['admin/menu']);
            }, (errorResponse: HttpErrorResponse) => {
                if (errorResponse.error === 'Zestaw dnia już istnieje') {
                    this.toastr.error(errorResponse.error);
                    this.router.navigate(['admin/menu']);
                } else
                    this.toastr.error(ERROR_SERVER_MESSAGE);
            });

        this.filteredDishesGroup = this.dishesGroup;
    }

    getSelectedDishName(dish: Dish) {
        return dish ? `${dish.name} - ${dish.amount} szt.` : '';
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

    private getDishesToSave() {
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
            dishId: new FormControl('', Validators.required),
            price: new FormControl('', [Validators.required, Validators.min(0.01)]),
            limit: new FormControl('', [Validators.required, Validators.min(0)])
        });
    }
}



