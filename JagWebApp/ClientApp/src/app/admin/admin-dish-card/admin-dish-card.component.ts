import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_UPDATE_MENU_MESSAGE } from '../../user-messages/messages';
import { MatDialog } from '@angular/material';
import { OrdinaryMenuItem } from '../../models/ordinary-menu-item';
import { DialogEditMenuItemComponent } from '../dialog-edit-menu-item/dialog-edit-menu-item.component';
import { UpdateMenuItem } from '../../models/update-menu-item';

@Component({
  selector: 'app-admin-dish-card',
  templateUrl: './admin-dish-card.component.html',
  styleUrls: ['./admin-dish-card.component.css']
})
export class AdminDishCardComponent implements OnInit {
    defualtImg: string;
    @Input() menuItem: OrdinaryMenuItem;
    @Output() onDeleteMenuItem = new EventEmitter();
    @Output() onUpdateMenuItem = new EventEmitter();

    constructor(private menuService: MenuService, private toastr: ToastrService, public dialog: MatDialog) { }

    ngOnInit() {
        this.defualtImg = 'default.png';
    }

    deleteItem(item) {
        this.menuService.deleteItem(item.id)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onDeleteMenuItem.emit(item);
            });
    }

    showModal(menuItem: OrdinaryMenuItem) {
        const dialogRef = this.dialog.open(DialogEditMenuItemComponent, {
            data: { price: menuItem.price, available: menuItem.available }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result)
                this.updateItem(menuItem.id, result);
        });
    }

    updateItem(itemId, data) {
        let item: UpdateMenuItem = {
            id: itemId,
            data: data
        }
        this.menuService.updateItem(item)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onUpdateMenuItem.emit(item);
            });
    }
}
