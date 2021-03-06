import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from 'shared/services/auth.service';
import { AdminGuard } from './admin.guard';


describe('AdminGuard', () => {
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
      providers: [ 
        AdminGuard, 
        { provide: 'BASE_URL', useValue: baseURL } 
      ]
    });

    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should return true if user is admin', inject([AdminGuard], (guard: AdminGuard) => {
    spyOn(authService, 'isAdmin').and.returnValue(true);

    expect(guard.canActivate()).toBeTruthy();
  }));

  it('should navigate to home page if user is not admin', inject([AdminGuard], (guard: AdminGuard) => {
    spyOn(authService, 'isAdmin').and.returnValue(false);
    let spy = spyOn(router, 'navigate');

    expect(guard.canActivate()).toBeFalsy();
    expect(spy).toHaveBeenCalledWith(['']);
  }));
});
