import { AuthService } from './../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


describe('AuthGuard', () => {
  const baseURL = '';
  let authService;
  let router;
  let next: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot = {
    url: 'a',
    root: new ActivatedRouteSnapshot()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, RouterTestingModule.withRoutes([]),],
      providers: [ AuthGuard, { provide: 'BASE_URL', useValue: baseURL } ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should return true if user is logged in', inject([AuthGuard], (guard: AuthGuard) => {
    spyOn(authService, 'loggedIn').and.returnValue(true);

    expect(guard.canActivateChild(next, state)).toBeTruthy();
  }));

  it('should navigate to login page if user is not logged in', inject([AuthGuard], (guard: AuthGuard) => {
    spyOn(authService, 'loggedIn').and.returnValue(false);
    let spy = spyOn(router, 'navigate');

    expect(guard.canActivateChild(next, state)).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(['/login'], Object({ queryParams: Object({ returnUrl: 'a' }) }))
  }));
});
