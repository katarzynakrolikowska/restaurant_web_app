import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuButton } from '../../models/menu-button';

@Component({
  selector: 'app-toolbar-icon-buttons',
  templateUrl: './toolbar-icon-buttons.component.html',
  styleUrls: []
})
export class ToolbarIconButtonsComponent {

  @Input('buttons') buttons: MenuButton[] = [];
  @Output('onButtonClick') onButtonClick = new EventEmitter();

  constructor() { }

  get isMobile(): boolean {
    const width = document.documentElement.clientWidth;
    const breakpoint = 768;

    return width < breakpoint;
  }

  onClick(button: MenuButton) {
    this.onButtonClick.emit(button.label);
  }
}
