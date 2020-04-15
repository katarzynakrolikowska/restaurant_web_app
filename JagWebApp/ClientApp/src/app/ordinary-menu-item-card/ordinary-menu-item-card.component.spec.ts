import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule, MatDialog, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ordinaryMenuItemStub } from '../../test/stubs/ordinary-menu-item.stub';
import { updateMenuItemStub } from '../../test/stubs/update-menu-item.stub';
import { MenuService } from '../services/menu.service';
import { OrdinaryMenuItemCardComponent } from './ordinary-menu-item-card.component';


describe('OrdinaryMenuItemCardComponent', () => {
  const baseURL = '';
  let component: OrdinaryMenuItemCardComponent;
  let fixture: ComponentFixture<OrdinaryMenuItemCardComponent>;
  let menuService: MenuService;
  let toastr: ToastrService;
  let dialog;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrdinaryMenuItemCardComponent],
      imports: [
        HttpClientModule,
        MatCardModule,
        MatDialogModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers: [{ provide: 'BASE_URL', useValue: baseURL }],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdinaryMenuItemCardComponent);
    component = fixture.componentInstance;
    component.menuItem = ordinaryMenuItemStub;
    menuService = TestBed.get(MenuService);
    toastr = TestBed.get(ToastrService);
    dialog = TestBed.get(MatDialog);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteItem from service when confirming dialog returns true', () => {
    let spyMenuService = spyOn(menuService, 'deleteItem').and.returnValue(of(Object));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });

    component.openConfirmingDialog();

    expect(spyMenuService).toHaveBeenCalledWith(ordinaryMenuItemStub.id);
  });

  it('should NOT call deleteItem from service when confirming dialog returns false', () => {
    let spyMenuService = spyOn(menuService, 'deleteItem').and.returnValue(of(Object));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(false) });

    component.openConfirmingDialog();

    expect(spyMenuService).not.toHaveBeenCalled();
  });

  it('should show success toastr when deleteItem from service returns success', () => {
    spyOn(menuService, 'deleteItem').and.returnValue(of(Object));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(true) });
    let spyToastr = spyOn(toastr, 'success');

    component.openConfirmingDialog();

    expect(spyToastr).toHaveBeenCalled();
  });

  it('should call updateItem from service when dialog returns updateMenuItem object', () => {
    let spyMenuService = spyOn(menuService, 'updateItem').and.returnValue(of(Object));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(updateMenuItemStub) });

    component.showModal(ordinaryMenuItemStub);

    expect(spyMenuService).toHaveBeenCalledWith(jasmine.any(Number), updateMenuItemStub);
  });

  it('should show success toastr when updateItem from service returns success', () => {
    spyOn(menuService, 'updateItem').and.returnValue(of(Object));
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(updateMenuItemStub) });
    let spyToastr = spyOn(toastr, 'success');

    component.showModal(ordinaryMenuItemStub);

    expect(spyToastr).toHaveBeenCalled();
  });

  it('should open dialog when showModal is called', () => {
    let spy = spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(Object) });
    spyOn(menuService, 'updateItem').and.returnValue(of(Object));

    component.showModal(ordinaryMenuItemStub);

    expect(spy).toHaveBeenCalled();
  });

  it('should NOT call updateLimit when dialog returns undefined after closed', () => {
    spyOn(dialog, 'open').and.returnValue({ afterClosed: () => of(undefined) })
    let spy = spyOn(menuService, 'updateItem');

    component.showModal(ordinaryMenuItemStub);

    expect(spy).not.toHaveBeenCalled();
  });
});
