import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ERROR_SERVER_MESSAGE } from 'src/app/consts/user-messages.consts';
import { MenuItem } from '../../models/menu-item';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-admin-main-item-edit-form',
  templateUrl: './admin-main-item-edit-form.component.html',
  styleUrls: ['./admin-main-item-edit-form.component.css']
})
export class AdminMainItemEditFormComponent implements OnInit {
  mainMenuItemToUpdate: MenuItem;
  itemId: number;

  constructor(
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService) {
    if (this.route.snapshot.params['item'] !== 'mainitem') {
      this.router.navigate(['menu']);
      return;
    }
      
    this.itemId = +this.route.snapshot.params['id'];

    if (isNaN(this.itemId) || this.itemId <= 0) {
      this.router.navigate(['menu']);
      return;
    }
  }

  ngOnInit() {
    this.menuService.getMenuItem(this.itemId)
      .subscribe(menuItem => {
        if (!menuItem.isMain) {
          this.toastr.error(ERROR_SERVER_MESSAGE);
          this.router.navigate(['menu']);
        }
        this.mainMenuItemToUpdate = menuItem;
      }, (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status !== 404)
            this.toastr.error(ERROR_SERVER_MESSAGE);

          this.router.navigate(['menu']);
        });
  }
}
