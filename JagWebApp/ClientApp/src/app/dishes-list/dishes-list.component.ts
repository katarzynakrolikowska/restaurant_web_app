import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Dish } from '../models/dish';

@Component({
  selector: 'app-dishes-list',
  templateUrl: './dishes-list.component.html',
  styleUrls: ['./dishes-list.component.css']
})
export class DishesListComponent implements OnInit {
    @Input() dishes: Array<Dish>;
    @Output() onDishClick = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    removeFromList(dishId) {
        let index = this.dishes.findIndex(d => d.id === dishId);
        this.dishes.splice(index, 1);

        this.onDishClick.emit(this.dishes);
    }

}
