import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';
import { OrdinaryMenuItem } from '../../models/ordinary-menu-item';

@Component({
  selector: 'app-ordinary-menu-items-view',
  templateUrl: './ordinary-menu-items-view.component.html',
  styleUrls: []
})
export class OrdinaryMenuItemsViewComponent {
  @Input('filtered-menu-items') filteredMenuItems: Array<OrdinaryMenuItem> = [];

  constructor(private router: Router, private authService: AuthService) { }

  addDishToMenu() {
    this.router.navigate(['admin/menu/item/new']);
  }
}
