import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DialogConfirmComponent } from 'shared/components/dialog-confirm/dialog-confirm.component';
import { MenuItem } from 'shared/models/menu-item';
import { AuthService } from 'shared/services/auth.service';
import { MenuService } from 'shared/services/menu.service';
import { MenuButton } from '../../models/menu-button';

@Component({
  selector: 'app-main-menu-item-view',
  templateUrl: './main-menu-item-view.component.html',
  styleUrls: []
})
export class MainMenuItemViewComponent implements OnInit {
  buttons: Array<MenuButton> = [];

  @Input('main-menu-item') mainMenuItem: MenuItem;

  constructor(
    private router: Router,
    private menuService: MenuService,
    private authService: AuthService,
    public dialog: MatDialog) { }

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
        this.openConfirmingDialog();
        break;
      default: return;
    }
  }

  private addMainItem() {
    this.router.navigate(['admin/menu/mainitem/new']);
  }

  private editMainItem() {
    if (this.mainMenuItem)
      this.router.navigate(['admin/menu/mainitem/edit/' + this.mainMenuItem.id]);
  }

  private openConfirmingDialog(): void { 
    let data = this.mainMenuItem.ordered > 0
      ? 'Wybrana pozycja jest już zamówiona. Czy napewno chcesz ją usunąć?'
      : 'Czy napewno chcesz usunąć wybraną pozycję?';

    const dialogRef = this.dialog.open(
      DialogConfirmComponent,
      { data: data });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.removeMainItem();
    });
  }

  private removeMainItem() {
    if (this.mainMenuItem)
      this.menuService.delete(this.mainMenuItem.id)
        .subscribe(() => { });
  }
}
