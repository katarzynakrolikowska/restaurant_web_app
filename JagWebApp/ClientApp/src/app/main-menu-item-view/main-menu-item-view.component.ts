import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../models/dish';
import { MainMenuItem } from '../models/main-menu-item';

@Component({
  selector: 'app-main-menu-item-view',
  templateUrl: './main-menu-item-view.component.html',
  styleUrls: ['./main-menu-item-view.component.css']
})
export class MainMenuItemViewComponent implements OnInit {
    dishes: Array<Dish>;
    @Input() mainMenuItem: MainMenuItem;

    constructor() { }

    ngOnInit() {
        
    }

}
