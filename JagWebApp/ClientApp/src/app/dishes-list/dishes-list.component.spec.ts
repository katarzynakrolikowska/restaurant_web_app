import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DishesListComponent } from './dishes-list.component';
import { MatIconModule, MatListModule } from '@angular/material';


describe('DishesListComponent', () => {
    let component: DishesListComponent;
    let fixture: ComponentFixture<DishesListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DishesListComponent],
            imports: [MatIconModule, MatListModule]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DishesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
