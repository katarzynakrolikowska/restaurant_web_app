import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainMenuItem } from '../models/main-menu-item';
import { MatDialog } from '@angular/material';
import { DialogEditMenuItemComponent } from '../admin/dialog-edit-menu-item/dialog-edit-menu-item.component';
import { UpdateMenuItem } from '../models/update-menu-item';
import { MenuService } from '../services/menu.service';
import { ToastrService } from 'ngx-toastr';
import { SUCCESS_UPDATE_MENU_MESSAGE } from '../user-messages/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-menu-item-view',
  templateUrl: './main-menu-item-view.component.html',
  styleUrls: ['./main-menu-item-view.component.css']
})
export class MainMenuItemViewComponent implements OnInit {

    @Input() mainMenuItem: MainMenuItem;

    @Output() onUpdateMainMenuItem = new EventEmitter();


    constructor(
        public dialog: MatDialog,
        private menuService: MenuService,
        private toastr: ToastrService,
        private router: Router
    ) { }

    ngOnInit() {
        
    }

    addMainItem() {
        this.router.navigate(['admin/menu/new/' + 'mainitem'])
    }

    showModal() {
        const dialogRef = this.dialog.open(DialogEditMenuItemComponent, {
            data: { price: this.mainMenuItem.price, available: this.mainMenuItem.available }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result)
                this.updateItem(result);
        });
    }

    updateItem(data) {
        let item: UpdateMenuItem = {
            id: this.mainMenuItem.id,
            data: data
        }
        this.menuService.updateItem(item)
            .subscribe(() => {
                this.toastr.success(SUCCESS_UPDATE_MENU_MESSAGE);
                this.onUpdateMainMenuItem.emit(item);
            });
    }
}
