import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../models/dish';

@Component({
  selector: 'app-main-menu-item-dish-card',
    templateUrl: './main-menu-item-dish-card.component.html',
    styleUrls: ['./main-menu-item-dish-card.component.css']
})
export class MainMenuItemDishCardComponent implements OnInit {
    defualtImg: string;

    @Input() dish: Dish;

    constructor() { }

    ngOnInit() {
        this.defualtImg = 'default.png';
    }
}
