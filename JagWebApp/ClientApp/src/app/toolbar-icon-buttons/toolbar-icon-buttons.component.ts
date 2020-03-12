import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MenuButton } from '../models/menu-button';

@Component({
  selector: 'app-toolbar-icon-buttons',
  templateUrl: './toolbar-icon-buttons.component.html',
  styleUrls: ['./toolbar-icon-buttons.component.css']
})
export class ToolbarIconButtonsComponent implements OnInit {
    isMobile: boolean;

    @Input('buttons') buttons: Array<MenuButton>;
    @Output('onButtonClick') onButtonClick = new EventEmitter();

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
