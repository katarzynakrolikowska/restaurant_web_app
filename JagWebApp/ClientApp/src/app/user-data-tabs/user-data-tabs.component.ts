import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Component({
  selector: 'app-user-data-tabs',
  templateUrl: './user-data-tabs.component.html',
  styleUrls: ['./user-data-tabs.component.css']
})
export class UserDataTabsComponent implements OnInit {
  selected: number;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => this.selected = params.selected)
  }
}
