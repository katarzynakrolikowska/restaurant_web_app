import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { ToolbarIconButtonsComponent } from './toolbar-icon-buttons.component';

describe('ToolbarIconButtonsComponent', () => {
  let component: ToolbarIconButtonsComponent;
  let fixture: ComponentFixture<ToolbarIconButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolbarIconButtonsComponent],
      imports: [MatMenuModule, MatIconModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarIconButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
