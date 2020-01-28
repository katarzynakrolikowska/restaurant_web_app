import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DishTabsComponent } from './dish-tabs.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DishTabsComponent', () => {
  let component: DishTabsComponent;
  let fixture: ComponentFixture<DishTabsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DishTabsComponent],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DishTabsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
