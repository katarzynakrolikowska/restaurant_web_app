import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'shared/services/auth.service';

@Component({
  selector: 'app-user-data-tabs',
  templateUrl: './user-data-tabs.component.html',
  styleUrls: []
})
export class UserDataTabsComponent implements OnInit {
  selected: number;

  constructor(
    public authService: AuthService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.selected)
        this.selected = params.selected;
    });
  }
}
