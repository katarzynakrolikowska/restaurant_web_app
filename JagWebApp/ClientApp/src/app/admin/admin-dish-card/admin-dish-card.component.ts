import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuItem } from '../../models/menuItem';
import { MenuService } from '../../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_UPDATE_MENU_MESSAGE } from '../../user-messages/messages';
import { MatDialog } from '@angular/material';
import { DialogEditLimitComponent } from '../dialog-edit-limit/dialog-edit-limit.component';

@Component({
  selector: 'app-admin-dish-card',
  templateUrl: './admin-dish-card.component.html',
  styleUrls: ['./admin-dish-card.component.css']
})
export class AdminDishCardComponent implements OnInit {
    defualtImg: string;
    @Input() menuItem: MenuItem;
    @Output() onDeleteMenuItem = new EventEmitter();
    @Output() onUpdateMenuItem = new EventEmitter();

    constructor(private menuService: MenuService, private toastr: ToastrService, public dialog: MatDialog) { }

    ngOnInit() {
        this.defualtImg = 'default.png';
    }

    deleteItem(id) {
        this.menuService.deleteItem(id)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onDeleteMenuItem.emit(id);
            });
    }

    showModal(menuItem: MenuItem) {
        const dialogRef = this.dialog.open(DialogEditLimitComponent, { data: menuItem.limit });

        dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.updateLimit(menuItem.id, result);
        });

    }

    updateLimit(itemId, newLimit) {
        this.menuService.updateLimit(itemId, newLimit)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onUpdateMenuItem.emit({ id: itemId, limit: newLimit });
            });
    }
}
