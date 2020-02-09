import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuButton } from '../models/menu-button';

@Component({
  selector: 'app-menu-buttons',
  templateUrl: './menu-buttons.component.html',
  styleUrls: ['./menu-buttons.component.css']
})
export class MenuButtonsComponent implements OnInit {

    isMobile: boolean;

    @Input() buttons: Array<MenuButton>;
    @Output() onButtonClick = new EventEmitter();

    constructor() { }

    ngOnInit() {
        this.isMobile = this.getIsMobile();
        window.onresize = () => {
            this.isMobile = this.getIsMobile();
        };
    }

    getIsMobile(): boolean {
        const width = document.documentElement.clientWidth;
        const breakpoint = 768;

        return width < breakpoint;
    }

    onClick(button: MenuButton) {
        this.onButtonClick.emit(button.label);
    }

}
