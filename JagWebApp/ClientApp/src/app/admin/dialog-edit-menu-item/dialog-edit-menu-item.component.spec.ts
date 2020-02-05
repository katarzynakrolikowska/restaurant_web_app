import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogEditMenuItemComponent } from './dialog-edit-menu-item.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('DialogEditMenuItemComponent', () => {
    let component: DialogEditMenuItemComponent;
    let fixture: ComponentFixture<DialogEditMenuItemComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DialogEditMenuItemComponent],
            imports: [
                MatDialogModule
            ],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { price: 1, available: 1 } }
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DialogEditMenuItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
