import { TestBed, async, inject } from '@angular/core/testing';

import { AdminGuard } from './admin.guard';
import { HttpClientModule } from '@angular/common/http';

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
