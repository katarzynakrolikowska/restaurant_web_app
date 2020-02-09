import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { MainMenuItem } from '../../models/main-menu-item';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ERROR_SERVER_MESSAGE } from '../../user-messages/messages';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-main-item-edit-form',
  templateUrl: './admin-main-item-edit-form.component.html',
  styleUrls: ['./admin-main-item-edit-form.component.css']
})
export class AdminMainItemEditFormComponent implements OnInit {
    mainMenuItemToUpdate: MainMenuItem;
    itemId: number;

    constructor(private menuService: MenuService, private route: ActivatedRoute, private router: Router,
        private toastr: ToastrService) {
        if (this.route.snapshot.params['item'] !== 'mainitem') {
            this.router.navigate(['/admin/menu']);
            return;
        }
            
        this.itemId = +this.route.snapshot.params['id'];

        if (isNaN(this.itemId) || this.itemId <= 0) {
            this.router.navigate(['/admin/menu']);
            return;
        }
    }

    ngOnInit() {
        this.menuService.getMenuItem(this.itemId)
            .subscribe((result: MainMenuItem) => {
                if (!result.isMain) {
                    this.toastr.error(ERROR_SERVER_MESSAGE);
                    this.router.navigate(['/admin/menu']);
                }

                this.mainMenuItemToUpdate = result;
            },
                (errorResponse: HttpErrorResponse) => {
                    if (errorResponse.status !== 404)
                        this.toastr.error(ERROR_SERVER_MESSAGE);

                    this.router.navigate(['/admin/menu']);
                });
    }
}
