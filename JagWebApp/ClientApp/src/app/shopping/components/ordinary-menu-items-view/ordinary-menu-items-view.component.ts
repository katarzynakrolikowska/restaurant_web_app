import { OrdinaryMenuItem } from 'src/app/shopping/models/ordinary-menu-item';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';

@Component({
  selector: 'app-ordinary-menu-items-view',
  templateUrl: './ordinary-menu-items-view.component.html',
  styleUrls: []
})
export class OrdinaryMenuItemsViewComponent {
  @Input('filtered-menu-items') filteredMenuItems: OrdinaryMenuItem[] = [];

  constructor(private router: Router, public authService: AuthService) { }

  addDishToMenu() {
    this.router.navigate(['admin/menu/item/new']);
  }
}
