import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dish } from 'shared/models/dish';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: []
})
export class DishesListComponent {
  @Input('dishes') dishes: Array<Dish> = [];
  @Output('onDishClick') onDishClick = new EventEmitter();

  constructor() { }
   
  removeFromList(dishId: number) {
    let index = this.dishes.findIndex(d => d.id === dishId);
    this.dishes.splice(index, 1);

    this.onDishClick.emit(this.dishes);
  }
}
