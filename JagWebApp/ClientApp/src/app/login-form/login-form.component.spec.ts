import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginFormComponent } from './login-form.component';
import { ReactiveFormsModule, FormControl, AbstractControl } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { of, empty, throwError, Subject } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params, convertToParamMap } from '@angular/router';


describe('LoginFormComponent', () => {
    const baseURL = '';
    let component: LoginFormComponent;
    let fixture: ComponentFixture<LoginFormComponent>;
    let emailControl: AbstractControl;
    let passwordControl: AbstractControl;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginFormComponent],
            imports: [ReactiveFormsModule, HttpClientModule, ToastrModule.forRoot(),
                BrowserAnimationsModule, RouterTestingModule.withRoutes([])
            ],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }

            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        emailControl = component.email;
        passwordControl = component.password;
        authService = TestBed.get(AuthService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with two controls', () => {
        expect(emailControl).toBeTruthy();
        expect(passwordControl).toBeTruthy();
    });

    it('should make email control required', () => {
        emailControl.setValue('');

        expect(emailControl.invalid).toBeTruthy();
    });

    it('should make password control required', () => {
        passwordControl.setValue('');

        expect(passwordControl.invalid).toBeTruthy();
    });

    it('should call the server to login user after submit if form is valid', () => {
        let spy = spyOn(authService, 'login').and.returnValue(empty());

        setControls();
        component.login();

        expect(spy).toHaveBeenCalled();
    });

    it('should set errorLogin to false after successful login', () => {
        component.errorLogin = true;
        spyOn(authService, 'login').and.returnValue(of({}));
        setControls();
        component.login();

        expect(component.errorLogin).toBeFalsy();
    });

    it('should redirect user to home page after successful login', () => {
        let router = TestBed.get(Router);
        let spy = spyOn(router, 'navigate');

        spyOn(authService, 'login').and.returnValue(of({}));
        setControls();
        component.login();

        expect(spy).toHaveBeenCalledWith(['/']);
    });

    //it('should redirect user to redirectUrl', () => {
    //    let router = TestBed.get(Router);
    //    let route = TestBed.get(ActivatedRoute);
    //    let spy = spyOn(router, 'navigate');
    //    spyOn(authService, 'login').and.returnValue(of({}));
    //    setControls();
        

    //    component.login();

    //    expect(spy).toHaveBeenCalledWith(['a']);
    //});

    it('should set error notification when server return error', () => {
        let errorRespone = new HttpErrorResponse({});

        spyOn(authService, 'login').and.returnValue(throwError(errorRespone));
        setControls();
        component.login();

        expect(component.errorLogin).toBeTruthy();
        expect(component.errorMessage).not.toBe('');
    });

    it('should set specific errorMessage when server return error with status 401', () => {
        let errorRespone = new HttpErrorResponse({ status: 401 });

        spyOn(authService, 'login').and.returnValue(throwError(errorRespone));
        setControls();
        component.login();

        expect(component.errorMessage).toContain('email');

    });

    function setControls() {
        emailControl.setValue('a');
        passwordControl.setValue('a');
    } 
});
