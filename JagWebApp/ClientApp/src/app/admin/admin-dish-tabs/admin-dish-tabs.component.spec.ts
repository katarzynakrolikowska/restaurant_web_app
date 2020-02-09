import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AdminDishTabsComponent } from './admin-dish-tabs.component';

describe('AdminDishTabsComponent', () => {
  let component: AdminDishTabsComponent;
  let fixture: ComponentFixture<AdminDishTabsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdminDishTabsComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDishTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
