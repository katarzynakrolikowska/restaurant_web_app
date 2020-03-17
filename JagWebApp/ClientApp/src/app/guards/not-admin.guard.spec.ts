import { inject, TestBed } from '@angular/core/testing';
import { NotAdminGuard } from './not-admin.guard';


xdescribe('NotAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotAdminGuard]
    });
  });

  it('should ...', inject([NotAdminGuard], (guard: NotAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
