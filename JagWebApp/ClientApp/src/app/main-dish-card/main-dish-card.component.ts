import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../models/dish';

@Component({
  selector: 'app-main-dish-card',
  templateUrl: './main-dish-card.component.html',
  styleUrls: ['./main-dish-card.component.css']
})
export class MainDishCardComponent implements OnInit {
    defualtImg: string;

    @Input() dish: Dish;

    constructor() { }

    ngOnInit() {
        this.defualtImg = 'default.png';
    }

}
