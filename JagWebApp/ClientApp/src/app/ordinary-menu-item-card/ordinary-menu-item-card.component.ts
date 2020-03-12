import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { OrdinaryMenuItem } from '../models/ordinary-menu-item';
import { MenuService } from '../services/menu.service';
import { SUCCESS_UPDATE_MENU_MESSAGE } from '../user-messages/messages';
import { AdminOrdinaryItemEditDialogComponent } from '../admin/admin-ordinary-item-edit-dialog/admin-ordinary-item-edit-dialog.component';
import { UpdateMenuItem } from '../models/update-menu-item';

@Component({
  selector: 'app-ordinary-menu-item-card',
  templateUrl: './ordinary-menu-item-card.component.html',
  styleUrls: ['./ordinary-menu-item-card.component.css']
})
export class OrdinaryMenuItemCardComponent {
    @Input('menu-item') menuItem: OrdinaryMenuItem;
    @Input('is-admin') isAdmin: boolean;
    @Output('onDeleteMenuItem') onDeleteMenuItem = new EventEmitter();
    @Output('onUpdateMenuItem') onUpdateMenuItem = new EventEmitter();

    constructor(private menuService: MenuService, private toastr: ToastrService, public dialog: MatDialog) { }

    deleteItem(item) {
        this.menuService.deleteItem(item.id)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onDeleteMenuItem.emit(item);
            });
    }

    showModal(menuItem: OrdinaryMenuItem) {
        const dialogRef = this.dialog.open(AdminOrdinaryItemEditDialogComponent, {
            data: { price: menuItem.price, available: menuItem.available }
        });

        dialogRef.afterClosed().subscribe(dialogResult => {
            if (dialogResult)
                this.updateItem(menuItem.id, dialogResult);
        });
    }

    updateItem(itemId, data) {
        let item: UpdateMenuItem = Object.assign({}, data);
        
        this.menuService.updateItem(itemId, item)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onUpdateMenuItem.emit({ item: item, id: itemId });
            });
    }
}
