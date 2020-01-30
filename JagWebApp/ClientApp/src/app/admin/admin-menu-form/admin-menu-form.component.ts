import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DishService } from '../../services/dish.service';
import { DataForAutocomplete } from '../../models/dataForAutocomplete';
import { Dish } from '../../models/dish';
import {
    ERROR_REQUIRED_MESSAGE,
    ERROR_MISMATCH_MENU_ITEMS_MESSAGE,
    ERROR_PATTERN_MESSAGE
} from '../../user-messages/messages';
import { menuItemMatch } from '../../validators/menu-item.validator';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../models/menuItem';


@Component({
  selector: 'app-admin-menu-form',
    templateUrl: './admin-menu-form.component.html',
    styleUrls: ['./admin-menu-form.component.css']
})
export class AdminMenuFormComponent implements OnInit {
    form: FormGroup;
    dishesGroup: Array<DataForAutocomplete> = [];
    filteredDishesGroup: Array<DataForAutocomplete> = [];

    constructor(private dishService: DishService, private menuService: MenuService) { }

    ngOnInit() {
        this.initForm();

        this.dishService.getDishes()
            .subscribe(result => {
                let group = {};

                this.dish.setValidators(
                    [
                        Validators.required,
                        menuItemMatch(result)
                    ]
                );
                
                result.forEach(function (dish) {
                    group[dish.category.name] = group[dish.category.name] || [];
                    group[dish.category.name]
                        .push({ id: dish.id, name: dish.name, price: dish.price, amount: dish.amount });
                });

                for (let [key, value] of Object.entries(group)) {
                    let data: DataForAutocomplete = {
                        categoryName: key,
                        dishes: value as Array<Dish>
                    };

                    this.dishesGroup.push(data);
                }

                this.filteredDishesGroup = this.dishesGroup;
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

    get limit() {
        return this.form.get('limit');
    }

    getDishErrorMessage() {
        return this.dish.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.dish.hasError('mismatch') ? ERROR_MISMATCH_MENU_ITEMS_MESSAGE :
            '';
    }

    getLimitErrorMessage() {
        return this.limit.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.limit.hasError('min') ? ERROR_PATTERN_MESSAGE:
                '';
    }

    onSave() {
        if (this.form.invalid)
            return;

        let menuItem: MenuItem = {
            dishId: this.dish.value.id,
            limit: this.limit.value
        };

        return this.menuService.create(menuItem)
            .subscribe(result => console.log('ok', result));
    }

    getSelectedDishName(dish: Dish) {
        return dish ? dish.name : dish;
    }

   

    private filterGroup(value: string): DataForAutocomplete[] {
        if (value) {
            return this.filteredDishesGroup
                .map(group => ({ categoryName: group.categoryName, dishes: this.filter(group.dishes, value) }))
                .filter(group => group.dishes.length > 0);
        }
    }

    private filter = (opt: Dish[], value: string): Dish[] => {
        const filterValue = value.toLowerCase();

        return opt.filter(item => item.name.toLowerCase().indexOf(filterValue) === 0);
    };

    private initForm() {
        this.form = new FormGroup({
            dishId: new FormControl(''),
            limit: new FormControl('', [Validators.required, Validators.min(0)])
        });
    }
}



