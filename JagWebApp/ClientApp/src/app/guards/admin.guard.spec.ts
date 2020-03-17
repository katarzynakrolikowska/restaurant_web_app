import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { AdminGuard } from './admin.guard';


xdescribe('AdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ AdminGuard ]
  });
  });

  it('should ...', inject([AdminGuard], (guard: AdminGuard) => {
  expect(guard).toBeTruthy();
  }));
});
