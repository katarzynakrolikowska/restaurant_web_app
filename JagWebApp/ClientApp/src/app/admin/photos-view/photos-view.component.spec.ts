import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotosViewComponent } from './photos-view.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { PhotoService } from '../../services/photo.service';
import { of, empty } from 'rxjs';
import { Photo } from '../../models/photo';
import { ActivatedRoute } from '@angular/router';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { activatedRouteStub } from '../../test/stubs/activated-route.stub';


describe('PhotosViewComponent', () => {
    const baseURL = '';
    let photo: Photo;
    let photos: Array<Photo>;
    
    let component: PhotosViewComponent;
    let fixture: ComponentFixture<PhotosViewComponent>;
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
            declarations: [PhotosViewComponent],
            providers: [
                { provide: 'BASE_URL', useValue: baseURL },
                { provide: ActivatedRoute, useValue: activatedRouteStub },
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        photo = { id: 1, name: 'a', thumbnailName: 'b', isMain: true };
        photos = [photo];
        fixture = TestBed.createComponent(PhotosViewComponent);
        component = fixture.componentInstance;
        photoService = TestBed.get(PhotoService);
        spyOn(photoService, 'getPhotos').and.returnValue(of(photos));

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
        let photo: Photo;
        let file: File;
        let spy = spyOn(photoService, 'upload').and.returnValue(of(photo));
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
