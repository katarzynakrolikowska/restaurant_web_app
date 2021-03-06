import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { empty, of } from 'rxjs';
import { AuthService } from 'shared/services/auth.service';
import { UserService } from 'shared/services/user.service';
import { EditEmailFormComponent } from './edit-email-form.component';

describe('EditEmailFormComponent', () => {
  const baseURL = '';
  let component: EditEmailFormComponent;
  let fixture: ComponentFixture<EditEmailFormComponent>;
  let userService: UserService;
  let service: AuthService;
  let emailAddress = 'email@abc.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmailFormComponent],
      imports: [HttpClientModule, ToastrModule.forRoot()],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailFormComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    service = TestBed.get(AuthService);
    spyOn(service, 'isLoggedIn').and.returnValue(true);
    spyOnProperty(service, 'userEmail').and.returnValue('email@abc.com');
    spyOn(service, 'userExists').and.callFake(email => email === emailAddress ? of(true) : of(false));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with one control', () => {
    expect(component.email).toBeTruthy();
  });

  it('should call the server to change user email after submit', () => {
    let spy = spyOn(userService, 'updateEmail').and.returnValue(empty());
    component.email.setValue(emailAddress);

    component.saveEmail();

    expect(spy).toHaveBeenCalled();
  });
});
