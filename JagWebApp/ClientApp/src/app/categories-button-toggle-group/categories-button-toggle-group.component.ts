import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';
import { CATEGORY_ALL_MENU_ITEMS_ID, CATEGORY_MAIN_MENU_ITEM_ID } from '../consts/app-consts';

@Component({
  selector: 'app-categories-button-toggle-group',
  templateUrl: './categories-button-toggle-group.component.html',
  styleUrls: ['./categories-button-toggle-group.component.css']
})
export class CategoriesButtonToggleGroupComponent implements OnInit {
    categories: Array<Category>;
    @Output() onToggleCategory = new EventEmitter(); 

    constructor(private categoryService: CategoryService) { }

    ngOnInit() {
        this.categoryService.getCategories()
            .subscribe((result: Array<Category>) => {
                this.categories = result.sort((a, b) => a.name.localeCompare(b.name));
                let categoryAll: Category = {
                    id: CATEGORY_ALL_MENU_ITEMS_ID,
                    name: 'Wszystkie dania'
                };

                let categoryMainItem: Category = {
                    id: CATEGORY_MAIN_MENU_ITEM_ID,
                    name: 'Zestaw dnia'
                };
               
                this.categories.unshift(categoryMainItem);
                this.categories.unshift(categoryAll);
            });
    }

    toggle(categoryId) {
        this.onToggleCategory.emit(categoryId);
    }

    checked(id) {
        return id === CATEGORY_ALL_MENU_ITEMS_ID;
    }
}
