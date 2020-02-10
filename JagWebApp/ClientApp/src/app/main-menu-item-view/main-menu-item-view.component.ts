import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MainMenuItem } from '../models/main-menu-item';
import { Router } from '@angular/router';
import { MenuButton } from '../models/menu-button';
import { MenuService } from '../services/menu.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-main-menu-item-view',
  templateUrl: './main-menu-item-view.component.html',
  styleUrls: ['./main-menu-item-view.component.css']
})
export class MainMenuItemViewComponent implements OnInit {
    buttons: Array<MenuButton>;
    @Input() mainMenuItem: MainMenuItem;
    @Output() onDeleteMainMenuItem = new EventEmitter();

    constructor(private router: Router, private menuService: MenuService, private authService: AuthService) { }

    ngOnInit() {
        this.buttons = [
            { label: 'Dodaj', icon: 'add' },
            { label: 'Edytuj', icon: 'edit' },
            { label: 'Usuń', icon: 'delete' }
        ];
    }

    onButtonClick(buttonLabel: string) {
        switch (buttonLabel) {
            case this.buttons[0].label:
                this.addMainItem();
                break;
            case this.buttons[1].label:
                this.editMainItem();
                break;
            case this.buttons[2].label:
                this.removeMainItem();
                break;
            default: return;
        }
    }

    addMainItem() {
        this.router.navigate(['admin/menu/mainitem/new']);
    }

    editMainItem() {
        if (this.mainMenuItem)
            this.router.navigate(['admin/menu/mainitem/edit/' + this.mainMenuItem.id]);
    }

    removeMainItem() {
        if (this.mainMenuItem)
            this.menuService.deleteItem(this.mainMenuItem.id)
                .subscribe(() => {
                    this.onDeleteMainMenuItem.emit();
                });
    }
}
