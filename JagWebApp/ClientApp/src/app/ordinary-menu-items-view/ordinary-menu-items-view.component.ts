import { Component, Input, EventEmitter, Output } from '@angular/core';
import { OrdinaryMenuItem } from '../models/ordinary-menu-item';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ordinary-menu-items-view',
  templateUrl: './ordinary-menu-items-view.component.html',
  styleUrls: ['./ordinary-menu-items-view.component.css']
})
export class OrdinaryMenuItemsViewComponent {
    @Input() filteredMenuItems: Array<OrdinaryMenuItem> = [];
    @Output() onDeleteItem = new EventEmitter();
    @Output() onUpdateItem = new EventEmitter();
        
    constructor(private router: Router, private authService: AuthService) { }

    addDishToMenu() {
        this.router.navigate(['admin/menu/item/new']);
    }
}
