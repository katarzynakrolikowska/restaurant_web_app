import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../services/auth.service';
import { NotAuthGuard } from './not-auth.guard';


describe('NotAuthGuard', () => {
  const baseURL = '';
  let authService;
  let router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes([]),],
      providers: [ NotAuthGuard, { provide: 'BASE_URL', useValue: baseURL } ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should return true if user is not logged in', inject([NotAuthGuard], (guard: NotAuthGuard) => {
    spyOn(authService, 'loggedIn').and.returnValue(false);

    expect(guard.canActivate()).toBeTruthy();
  }));

  it('should navigate to home page if user is logged in', inject([NotAuthGuard], (guard: NotAuthGuard) => {
    spyOn(authService, 'loggedIn').and.returnValue(true);
    let spy = spyOn(router, 'navigate');

    expect(guard.canActivate()).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(['/'])
  }));
});
