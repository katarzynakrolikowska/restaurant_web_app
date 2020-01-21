import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';

xdescribe('UserService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientModule],

    }));

  it('should be created', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });
});
