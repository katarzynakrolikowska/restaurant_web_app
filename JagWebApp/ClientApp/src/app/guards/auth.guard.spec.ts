import { TestBed, async, inject } from '@angular/core/testing';

import { AuthGuard } from './auth.guard';
import { HttpClientModule } from '@angular/common/http';

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
