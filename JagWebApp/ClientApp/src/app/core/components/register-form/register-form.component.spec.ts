import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { empty, of } from 'rxjs';
import { AuthService } from 'shared/services/auth.service';
import { RegisterFormComponent } from './register-form.component';


describe('RegisterFormComponent', () => {
  const emailAddress = 'email@abc.com';
  const validPassword = 'aaaaaa';
  const baseURL = '';
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let emailControl: AbstractControl;
  let passwordControl: AbstractControl;
  let confirmPasswordControl: AbstractControl;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule, ToastrModule.forRoot(), BrowserAnimationsModule],
      declarations: [RegisterFormComponent],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    emailControl = component.email;
    passwordControl = component.password;
    confirmPasswordControl = component.confirmPassword;
    authService = TestBed.get(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create form with three controls', () => {
    expect(emailControl).toBeTruthy();
    expect(passwordControl).toBeTruthy();
    expect(confirmPasswordControl).toBeTruthy();
  });

  it('should make email control required', () => {
    emailControl.setValue('');

    expect(emailControl.invalid).toBeTruthy();
  });

  it('should make email control accepts only email type', () => {
    emailControl.setValue('a');

    expect(emailControl.invalid).toBeTruthy();
  });

  it('should make email control accepts only unique email', () => {
    spyOn(authService, 'userExists').and.callFake(email => email === emailAddress ? of(true) : of(false));
    spyOn(authService, 'loggedIn').and.returnValue(false);
    
    emailControl.setValue(emailAddress);

    expect(emailControl.invalid).toBeTruthy();
  });

  it('should make password control required', () => {
    passwordControl.setValue('');

    expect(passwordControl.invalid).toBeTruthy();
  });

  it('should make password control invalid if it contains less than 6 chars', () => {
    passwordControl.setValue('aaaaa');

    expect(passwordControl.invalid).toBeTruthy();
  });

  it('should make password control invalid if it contains greater than 20 chars', () => {
    passwordControl.setValue('aaaaaaaaaaaaaaaaaaaaa');

    expect(passwordControl.invalid).toBeTruthy();
  });

  it('should call the server to register new user after submit if form is valid', () => {
    let spyRegister = spyOn(authService, 'register').and.returnValue(empty());

    spyOn(authService, 'userExists').and.callFake(email => email === emailAddress ? of(false) : of(true));
    spyOn(authService, 'loggedIn').and.returnValue(false);
    setValidControls();

    component.register();

    expect(spyRegister).toHaveBeenCalled();
  });

  it('should raised newUserRegistered event after successful registration', () => {
    let step = 1;
    spyOn(authService, 'register').and.returnValue(of({}));
    spyOn(authService, 'userExists').and.callFake(email => email === emailAddress ? of(false) : of(true));
    spyOn(authService, 'loggedIn').and.returnValue(false);
    setValidControls();
    component.onNewUserRegistered.subscribe(s => step = s)

    component.register();

    expect(step).toBe(0);
  });

  function setValidControls() {
    emailControl.setValue(emailAddress);
    passwordControl.setValue(validPassword);
    confirmPasswordControl.setValue(validPassword);
  } 
});

