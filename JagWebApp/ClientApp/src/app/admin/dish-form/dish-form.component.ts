import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-dish-form',
  templateUrl: './dish-form.component.html',
  styleUrls: ['./dish-form.component.css']
})
export class DishFormComponent implements OnInit {

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
        route.params.subscribe(p => {
            this.id = +p['id'];
        });
        
        //if (isNaN(this.id) || this.id <= 0) {
        //    router.navigate(['/admin/dishes']);
        //    return;
        //}
    }

    ngOnInit() {
        let sources = [this.categoryService.getCategories()];

        if (this.id)
            sources.push(this.dishService.getDish(this.id));

        this.initForm();

        forkJoin(sources).subscribe(data => {
            this.categories = data[0];

            if (this.id) {
                delete data[1].id; //ugly
                this.dish = data[1];
                
                this.form.setValue(Object.assign({}, this.dish));
            }
        },
            error => {
                this.toastr.error('Coś poszło nie tak');
                this.router.navigate(['/admin/dishes']);
            }
        );
    }

    onSave() {
        if (this.form.invalid)
            return;

        this.dish = Object.assign({}, this.form.value);
        this.dishService.createDish(this.dish)
            .subscribe(() => {
                this.toastr.success('Danie zostało zapisane!');
                this.router.navigate(['/admin/dishes'])
            });
    }

    getNameErrorMessage() {
        return this.name.hasError('required') ? 'To pole jest obowiązkowe' :
            '';
    }

    getCategoryErrorMessage() {
        return this.category.hasError('required') ? 'To pole jest obowiązkowe' :
            '';
    }

    getPriceErrorMessage() {
        return this.price.hasError('required') ? 'To pole jest obowiązkowe' :
            this.price.hasError('min') ? 'Wpisana wartość musi być większa od 0' :
            '';
    }

    getAmountErrorMessage() {
        return this.amount.hasError('required') ? 'To pole jest obowiązkowe' :
            this.amount.hasError('min') ? 'Wpisana wartość musi być większa od 0' :
            this.amount.hasError('pattern') ? 'Wpisana wartość jest niepoprawna' :
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



}
