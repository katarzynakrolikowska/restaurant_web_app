import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
    ERROR_REQUIRED_MESSAGE,
    ERROR_MIN_MESSAGE,
    ERROR_PATTERN_MESSAGE,
    ERROR_SERVER_MESSAGE,
    SUCCESS_SAVE_DISH_MESSAGE
} from '../../user-messages/messages';


@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})
export class DishFormComponent implements OnInit {

    @Input() title: string = 'Nowe danie';
    form: FormGroup;
    categories: any;
    dish: Dish;
    id: number;

    constructor(
        private categoryService: CategoryService,
        private dishService: DishService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        
        
        //if (isNaN(this.id) || this.id <= 0) {
        //    router.navigate(['/admin/dishes']);
        //    return;
        //}
    }

    ngOnInit() {
        this.id = +this.route.snapshot.params['id'];

        let sources = [this.categoryService.getCategories()];

        if (this.id)
            sources.push(this.dishService.getDish(this.id));

        this.initForm();

        forkJoin(sources).subscribe(data => {
            this.categories = data[0];

            if (this.id) 
                this.initFormValues(data[1] as Dish);
        },
            error => {
                this.toastr.error(ERROR_SERVER_MESSAGE);
                this.router.navigate(['/admin/dishes']);
            }
        );
    }

    onSave() {
        if (this.form.invalid)
            return;

        this.dish = Object.assign({}, this.form.value);
        this.id ? this.updateDish() : this.createDish();
    }

    createDish() {
        this.dishService.createDish(this.dish)
            .subscribe(() => this.makeActionWhenServerReturnsSuccess());
    }

    updateDish() {
        this.dish.id = this.id;
        this.dishService.updateDish(this.dish)
            .subscribe(() => this.makeActionWhenServerReturnsSuccess());
    }

    getNameErrorMessage() {
        return this.name.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            '';
    }

    getCategoryErrorMessage() {
        return this.category.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            '';
    }

    getPriceErrorMessage() {
        return this.price.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.price.hasError('min') ? ERROR_MIN_MESSAGE + '0' :
            '';
    }

    getAmountErrorMessage() {
        return this.amount.hasError('required') ? ERROR_REQUIRED_MESSAGE :
            this.amount.hasError('min') ? ERROR_MIN_MESSAGE + '0' :
                this.amount.hasError('pattern') ? ERROR_PATTERN_MESSAGE :
            '';
    }

    get name() {
        return this.form.get('name');
    }

    get category() {
        return this.form.get('categoryId');
    }

    get price() {
        return this.form.get('price');
    }

    get amount() {
        return this.form.get('amount');
    }

    private initForm() {
      this.form = new FormGroup({
          name: new FormControl('', Validators.required),
          categoryId: new FormControl('', Validators.required),
          price: new FormControl('', [Validators.required, Validators.min(0.01)]),
          amount: new FormControl(1, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*')])
      });
    }

    private initFormValues(dish: Dish) {
        this.dish = dish;
        delete (dish.id);

        this.form.setValue(Object.assign({}, dish));
    }

    private makeActionWhenServerReturnsSuccess() {
        this.toastr.success(SUCCESS_SAVE_DISH_MESSAGE);
        this.router.navigate(['/admin/dishes'])
    }

}
