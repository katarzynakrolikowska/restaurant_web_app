import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { activatedRouteStub } from 'shared/test/stubs/activated-route.stub';
import { photoStub } from 'shared/test/stubs/photo.stub';
import { Photo } from '../../models/photo';
import { PhotoService } from '../../services/photo.service';
import { AdminPhotosViewComponent } from './admin-photos-view.component';


describe('AdminPhotosViewComponent', () => {
  const baseURL = '';
  let photos: Array<Photo> = [];
  
  let component: AdminPhotosViewComponent;
  let fixture: ComponentFixture<AdminPhotosViewComponent>;
  let photoService: PhotoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        MaterialFileInputModule
      ],
      declarations: [AdminPhotosViewComponent],
      providers: [
        { provide: 'BASE_URL', useValue: baseURL },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    photos = [photoStub];
    fixture = TestBed.createComponent(AdminPhotosViewComponent);
    component = fixture.componentInstance;
    photoService = TestBed.get(PhotoService);
    spyOn(photoService, 'getAll').and.returnValue(of(photos));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init photos', () => {
    expect(component.photos).toBe(photos);
    expect(component.id).toBe(1);
  });

  it('should call upload from photoService when uploadPhoto is called', () => {
    let file: File;
    let spy = spyOn(photoService, 'upload').and.returnValue(of(photoStub));
    spyOnProperty(component.fileInput, 'value').and.returnValue({ files: [file] });

    component.uploadPhoto();

    expect(spy).toHaveBeenCalledWith(1, file);
    expect(component.photos.length).toBe(2);
  });

  it('should call delete from photoService when deletePhoto is called', () => {
    let spy = spyOn(photoService, 'delete').and.returnValue(of(Object));

    component.deletePhoto(1);

    expect(spy).toHaveBeenCalled();
    expect(component.photos.length).toBe(0);
  });

  it('should call updateMainPhoto from photoService when toggleMainPhoto is called', () => {
    let spy = spyOn(photoService, 'updateMainPhoto').and.returnValue(of(0));

    component.toggleMainPhoto(1);
    let updatedPhoto = component.photos.filter(p => p.id === 1);

    expect(spy).toHaveBeenCalled();
    expect(updatedPhoto[0].isMain).toBeFalsy();
  });
});
