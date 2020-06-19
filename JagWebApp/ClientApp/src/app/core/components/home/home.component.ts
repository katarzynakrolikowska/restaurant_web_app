import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { MenuItem } from 'shared/models/menu-item';
import { MenuService } from 'shared/services/menu.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  mainMenuItem: MenuItem;

  constructor(
    private menuService: MenuService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    this.menuService.getMainItem()
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe(
        item => this.mainMenuItem = item,
        () => {}
      );
  }
}
