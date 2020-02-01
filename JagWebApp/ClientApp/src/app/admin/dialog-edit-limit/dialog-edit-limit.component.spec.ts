import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditLimitComponent } from './dialog-edit-limit.component';

describe('DialogEditLimitComponent', () => {
  let component: DialogEditLimitComponent;
  let fixture: ComponentFixture<DialogEditLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
