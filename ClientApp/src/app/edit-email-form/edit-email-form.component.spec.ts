import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailFormComponent } from './edit-email-form.component';

describe('EditEmailFormComponent', () => {
  let component: EditEmailFormComponent;
  let fixture: ComponentFixture<EditEmailFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmailFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
