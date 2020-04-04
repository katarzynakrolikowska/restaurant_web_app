import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { AdminOrdinaryItemEditDialogComponent } from '../admin/admin-ordinary-item-edit-dialog/admin-ordinary-item-edit-dialog.component';
import { SUCCESS_UPDATE_MENU_MESSAGE } from '../consts/user-messages.consts';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { OrdinaryMenuItem } from '../models/ordinary-menu-item';
import { UpdateMenuItem } from '../models/update-menu-item';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'app-ordinary-menu-item-card',
  templateUrl: './ordinary-menu-item-card.component.html',
  styleUrls: ['./ordinary-menu-item-card.component.css']
})
export class OrdinaryMenuItemCardComponent {
  @Input('menu-item') menuItem: OrdinaryMenuItem;
  @Input('is-admin') isAdmin: boolean;

  constructor(
    private menuService: MenuService, 
    private toastr: ToastrService, 
    public dialog: MatDialog) { }

  openConfirmingDialog(): void { 
    let data = this.menuItem.ordered > 0
      ? 'Wybrana pozycja jest już zamówiona. Czy napewno chcesz ją usunąć?'
      : 'Czy napewno chcesz usunąć wybraną pozycję?';

    const dialogRef = this.dialog.open(
      DialogConfirmComponent,
      { data: data });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.deleteItem();
    });
  }

  private deleteItem() {
    this.menuService.deleteItem(this.menuItem.id)
      .subscribe(() => this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE));
  }

  showModal(menuItem: OrdinaryMenuItem) {
    const dialogRef = this.dialog.open(
      AdminOrdinaryItemEditDialogComponent, {
      data: { price: menuItem.price, available: menuItem.available }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult)
        this.updateItem(menuItem.id, dialogResult);
    });
  }

  private updateItem(itemId, data) {
    let item: UpdateMenuItem = Object.assign({}, data);
    
    this.menuService.updateItem(itemId, item)
      .subscribe(() => this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE));
  }
}
