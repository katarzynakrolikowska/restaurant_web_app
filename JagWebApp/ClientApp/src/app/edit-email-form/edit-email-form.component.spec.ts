import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmailFormComponent } from './edit-email-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { empty, of } from 'rxjs';

describe('EditEmailFormComponent', () => {
    const baseURL = '';
    let component: EditEmailFormComponent;
    let fixture: ComponentFixture<EditEmailFormComponent>;
    let userService: UserService;
    let service: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditEmailFormComponent],
            imports: [HttpClientModule, ToastrModule.forRoot()],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }
            ],
            schemas: [NO_ERRORS_SCHEMA ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditEmailFormComponent);
        component = fixture.componentInstance;
        userService = TestBed.get(UserService);
        service = TestBed.get(AuthService);
        spyOn(service, 'loggedIn').and.returnValue(true);
        spyOn(service, 'getUserId').and.returnValue(1);
        spyOn(service, 'getUserEmail').and.returnValue('email@abc.com');
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with one control', () => {
        expect(component.email).toBeTruthy();
    });

    xit('should init form input with proper email', () => {
        let emailAddress = 'email@abc.com';
        spyOn(service, 'userExists').and.callFake(email => email === emailAddress ? of(true) : of(false));

        fixture.detectChanges();

        expect(component.email.value).toBe(emailAddress);
    });

    it('should call the server to change user email after submit', () => {
        let emailAddress = 'email@abc.com';
        spyOn(service, 'userExists').and.callFake(email => email === emailAddress ? of(true) : of(false));
        let spy = spyOn(userService, 'saveEmail').and.returnValue(empty());
        component.email.setValue(emailAddress);

        component.saveEmail();

        expect(spy).toHaveBeenCalled();
    });
});
