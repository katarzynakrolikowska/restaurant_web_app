import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EditPasswordFormComponent } from './edit-password-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { UserService } from '../services/user.service';
import { empty, throwError } from 'rxjs';

describe('EditPasswordFormComponent', () => {
    const baseURL = '';
    let component: EditPasswordFormComponent;
    let fixture: ComponentFixture<EditPasswordFormComponent>;
    let userService: UserService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EditPasswordFormComponent],
            imports: [HttpClientModule, ToastrModule.forRoot()],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL }  
            ],
            schemas: [NO_ERRORS_SCHEMA ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditPasswordFormComponent);
        component = fixture.componentInstance;
        userService = TestBed.get(UserService);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form with three controls', () => {
        expect(component.currentPassword).toBeTruthy();
        expect(component.newPassword).toBeTruthy();
        expect(component.confirmPassword).toBeTruthy();
    });

    it('should call the server to change user password after submit', () => {
        let spy = spyOn(userService, 'savePassword').and.returnValue(empty());

        setForm();
        component.savePassword();

        expect(spy).toHaveBeenCalled();
    });

    it('should set error properties if server return error', () => {
        let errorRespone = new HttpErrorResponse({});
        spyOn(userService, 'savePassword').and.returnValue(throwError(errorRespone));

        setForm();
        component.savePassword();

        expect(component.invalid).toBeTruthy();
        expect(component.errorMessage).not.toBe('');
    });

    it('should set specific errorMessage if server return error with status 400', () => {
        let errorRespone = new HttpErrorResponse({ status: 400 });
        spyOn(userService, 'savePassword').and.returnValue(throwError(errorRespone));

        setForm();
        component.savePassword();

        expect(component.errorMessage).toContain('hasło');
    });

    //integration
    xit('should show alert if server return error ', () => {
        component.invalid = true;
        component.errorMessage = 'a';
        fixture.detectChanges();

        let de = fixture.debugElement.query(By.css('alert'));
        let el: HTMLElement = de.nativeElement;

        expect(el.innerText).toBe('a');
    });

    function setForm() {
        let password = 'aaaaaa';

        component.currentPassword.setValue(password);
        component.newPassword.setValue(password);
        component.confirmPassword.setValue(password);
    }
});
