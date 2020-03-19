import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { 
  ERROR_MIN_MESSAGE, 
  ERROR_PATTERN_MESSAGE, 
  ERROR_REQUIRED_MESSAGE, 
  ERROR_SERVER_MESSAGE, 
  SUCCESS_SAVE_DISH_MESSAGE 
} from 'src/app/consts/user-messages.consts';
import { Category } from '../../models/category';
import { Dish } from '../../models/dish';
import { CategoryService } from '../../services/category.service';
import { DishService } from '../../services/dish.service';


@Component({
  selector: 'app-admin-dish-form',
  templateUrl: './admin-dish-form.component.html',
  styleUrls: ['./admin-dish-form.component.css']
})
export class AdminDishFormComponent implements OnInit {

  @Input('title') title: string = 'Nowe danie';
  form: FormGroup;
  categories: Array<Category>;
  dish: Dish;
  id;

  constructor(
    private categoryService: CategoryService,
    private dishService: DishService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {

    if (route.snapshot.routeConfig.path === 'admin/dishes/new')
      return;
    else {
      this.id = +this.route.snapshot.params['id'];
      if (isNaN(this.id) || this.id <= 0) {
        router.navigate(['/admin/dishes']);
        return;
      }
    }
  }

  ngOnInit() {
    let sources = [this.categoryService.getCategories()];

    if (this.id)
      sources.push(this.dishService.getDish(this.id));

    this.initForm();

    forkJoin(sources).subscribe(data => {
      this.categories = data[0];

      if (this.id) 
        this.initFormValues(data[1] as Dish);
    },
      () => {
        this.toastr.error(ERROR_SERVER_MESSAGE);
        this.router.navigate(['/admin/dishes']);
      }
    );
  }

  save() {
    if (this.form.invalid)
      return;

    this.dish = Object.assign({}, this.form.value);
    this.id ? this.updateDish() : this.createDish();
  }

  createDish() {
    this.dishService.createDish(this.dish)
      .subscribe(() => this.takeActionWhenServerReturnsSuccess());
  }

  updateDish() {
    this.dish.id = this.id;
    this.dishService.updateDish(this.dish)
      .subscribe(() => this.takeActionWhenServerReturnsSuccess());
  }

  getNameErrorMessage() {
    return this.name.hasError('required') ? ERROR_REQUIRED_MESSAGE :
      '';
  }

  getCategoryErrorMessage() {
    return this.category.hasError('required') ? ERROR_REQUIRED_MESSAGE :
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

  get amount() {
    return this.form.get('amount');
  }

  private initForm() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      categoryId: new FormControl('', Validators.required),
      amount: new FormControl(1, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*')])
    });
  }

  private initFormValues(dish: Dish) {
    this.dish = dish;
    delete (dish.id);

    this.form.setValue(Object.assign({}, dish));
  }

  private takeActionWhenServerReturnsSuccess() {
    this.toastr.success(SUCCESS_SAVE_DISH_MESSAGE);
    this.router.navigate(['/admin/dishes'])
  }
}
