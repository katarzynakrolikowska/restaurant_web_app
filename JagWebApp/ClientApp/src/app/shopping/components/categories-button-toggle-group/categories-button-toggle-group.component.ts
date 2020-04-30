import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ALL_MENU_ITEMS_CATEGORY_ID, MAIN_MENU_ITEM_CATEGORY_ID } from 'shared/consts/app.consts';
import { Category } from 'shared/models/category';
import { CategoryService } from 'shared/services/category.service';

@Component({
  selector: 'app-categories-button-toggle-group',
  templateUrl: './categories-button-toggle-group.component.html',
  styleUrls: ['./categories-button-toggle-group.component.css']
})
export class CategoriesButtonToggleGroupComponent implements OnInit {
  categories: Array<Category> = [];
  
  @Output('onToggleCategory') onToggleCategory = new EventEmitter(); 

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll()
      .subscribe((categories: Array<Category>) => {
        this.categories = categories.sort((a, b) => a.name.localeCompare(b.name));
        let categoryAll: Category = {
          id: ALL_MENU_ITEMS_CATEGORY_ID,
          name: 'Wszystkie dania'
        };

        let categoryMainItem: Category = {
          id: MAIN_MENU_ITEM_CATEGORY_ID,
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
    return id === ALL_MENU_ITEMS_CATEGORY_ID;
  }
}
