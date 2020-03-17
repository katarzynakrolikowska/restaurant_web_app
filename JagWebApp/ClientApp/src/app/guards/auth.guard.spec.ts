import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';


xdescribe('AuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule ],
      providers: [AuthGuard]
  });
  });

  it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
  expect(guard).toBeTruthy();
  }));
});
