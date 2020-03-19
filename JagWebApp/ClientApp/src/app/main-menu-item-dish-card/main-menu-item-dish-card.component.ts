import { Component, Input } from '@angular/core';
import { Dish } from '../models/dish';

@Component({
  selector: 'app-main-menu-item-dish-card',
    templateUrl: './main-menu-item-dish-card.component.html',
    styleUrls: ['./main-menu-item-dish-card.component.css']
})
export class MainMenuItemDishCardComponent {
  @Input('dish') dish: Dish;

  constructor() { }
}
