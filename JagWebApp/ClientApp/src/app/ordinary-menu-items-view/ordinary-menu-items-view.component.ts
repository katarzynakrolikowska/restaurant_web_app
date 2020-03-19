import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { OrdinaryMenuItem } from '../models/ordinary-menu-item';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-ordinary-menu-items-view',
  templateUrl: './ordinary-menu-items-view.component.html',
  styleUrls: ['./ordinary-menu-items-view.component.css']
})
export class OrdinaryMenuItemsViewComponent {
  @Input('filtered-menu-items') filteredMenuItems: Array<OrdinaryMenuItem> = [];

  constructor(private router: Router, private authService: AuthService) { }

  addDishToMenu() {
    this.router.navigate(['admin/menu/item/new']);
  }
}
