import { NotAuthGuard } from './not-auth.guard';
import { inject, TestBed } from '@angular/core/testing';
import { NotAdminGuard } from './not-admin.guard';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


describe('NotAdminGuard', () => {
  const baseURL = '';
  let authService;
  let router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        HttpClientModule,
        RouterTestingModule.withRoutes([]),
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [ NotAdminGuard, { provide: 'BASE_URL', useValue: baseURL } ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should return true if user is not admin', inject([NotAdminGuard], (guard: NotAdminGuard) => {
    spyOn(authService, 'isAdmin').and.returnValue(false);

    expect(guard.canActivate()).toBeTruthy();
  }));

  it('should navigate to home page if user is admin', inject([NotAdminGuard], (guard: NotAdminGuard) => {
    spyOn(authService, 'isAdmin').and.returnValue(true);
    let spy = spyOn(router, 'navigate');

    expect(guard.canActivate()).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(['']);
  }));
});
