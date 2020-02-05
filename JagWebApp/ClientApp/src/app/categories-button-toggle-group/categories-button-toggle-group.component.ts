import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category';

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
                let category: Category = {
                    id: 0,
                    name: 'Wszystkie kategorie'
                };

                this.categories.unshift(category);
            });
    }

    toggle(categoryId) {
        this.onToggleCategory.emit(categoryId);
    }

}
