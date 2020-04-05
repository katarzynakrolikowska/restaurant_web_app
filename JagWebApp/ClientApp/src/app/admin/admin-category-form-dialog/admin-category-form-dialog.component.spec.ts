import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCategoryFormDialogComponent } from './admin-category-form-dialog.component';

describe('AdminCategoryFormDialogComponent', () => {
  let component: AdminCategoryFormDialogComponent;
  let fixture: ComponentFixture<AdminCategoryFormDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCategoryFormDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategoryFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
