import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { DialogConfirmComponent } from 'shared/components/dialog-confirm/dialog-confirm.component';
import { SUCCESS_UPDATE_MENU_MESSAGE } from 'shared/consts/user-messages.consts';
import { UpdateMenuItem } from 'shared/models/update-menu-item';
import { MenuService } from 'shared/services/menu.service';
import { AdminOrdinaryItemEditDialogComponent } from 'src/app/admin/components/admin-ordinary-item-edit-dialog/admin-ordinary-item-edit-dialog.component';
import { OrdinaryMenuItem } from 'src/app/shopping/models/ordinary-menu-item';

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
    const data = this.menuItem.ordered > 0
      ? 'Wybrana pozycja jest już zamówiona. Czy napewno chcesz ją usunąć?'
      : 'Czy napewno chcesz usunąć wybraną pozycję?';

    const dialogRef = this.dialog.open(
      DialogConfirmComponent,
      { data: data }
    );

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result)
          this.deleteItem();
      });
  }

  private deleteItem() {
    this.menuService.delete(this.menuItem.id)
      .subscribe(() => this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE));
  }

  showDialog(menuItem: OrdinaryMenuItem) {
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
    const item: UpdateMenuItem = Object.assign({}, data);
    
    this.menuService.update(itemId, item)
      .subscribe(() => this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE));
  }
}
