import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCofirmComponent } from './dialog-cofirm.component';

xdescribe('DialogCofirmComponent', () => {
  let component: DialogCofirmComponent;
  let fixture: ComponentFixture<DialogCofirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogCofirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCofirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
