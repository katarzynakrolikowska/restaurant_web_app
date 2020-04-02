import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogOrderAcceptedComponent } from './dialog-order-accepted.component';

describe('DialogOrderAcceptedComponent', () => {
  let component: DialogOrderAcceptedComponent;
  let fixture: ComponentFixture<DialogOrderAcceptedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogOrderAcceptedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogOrderAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
