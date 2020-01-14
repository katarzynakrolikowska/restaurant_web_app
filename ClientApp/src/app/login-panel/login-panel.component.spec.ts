import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPanelComponent } from './login-panel.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LoginPanelComponent', () => {
    let component: LoginPanelComponent;
    let fixture: ComponentFixture<LoginPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LoginPanelComponent],
            schemas: [ NO_ERRORS_SCHEMA ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set step to 0 after calling setStep with paramwter 0', () => {
        component.setStep(0);

        expect(component.step).toBe(0);
    });

    //it('should open login panel after calling setStep with paramwter 0', () => {
    //    
    //});

    it('should set step to 1 after calling setStep with paramwter 1', () => {
        component.setStep(1);

        expect(component.step).toBe(1);
    });


});
