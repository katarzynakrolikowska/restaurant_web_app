import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FileInputComponent } from 'ngx-material-file-input';
import { ToastrService } from 'ngx-toastr';
import { ERROR_SERVER_MESSAGE } from 'src/app/consts/user-messages.consts';
import { Photo } from '../../models/photo';
import { PhotoService } from '../../services/photo.service';


@Component({
  selector: 'app-admin-photos-view',
  templateUrl: './admin-photos-view.component.html',
  styleUrls: ['./admin-photos-view.component.css']
})
export class AdminPhotosViewComponent implements OnInit {
  id: number;
  @ViewChild('fileInput', { static: true }) fileInput: FileInputComponent;
  photos: Array<Photo>;

  constructor(
    private photoService: PhotoService,
    private route: ActivatedRoute,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];

    this.photoService.getPhotos(this.id)
      .subscribe(photos => this.photos = photos);
  }
  
  uploadPhoto() {
    var file = this.fileInput.value.files[0];
    this.fileInput.clear();

    this.photoService.upload(this.id, file)
      .subscribe(
        photo => this.photos.push(photo),
        (errorRespone: HttpErrorResponse) => 
          errorRespone.status === 400 ? 
          this.toastr.error(errorRespone.error) : this.toastr.error(ERROR_SERVER_MESSAGE));
  }

  deletePhoto(photoId) {
    this.photoService.delete(photoId, this.id)
      .subscribe(() => {
        let index = this.photos.findIndex(p => p.id == photoId);
        this.photos.splice(index, 1);
      });
  }

  toggleMainPhoto(photoId) {
    this.photoService.updateMainPhoto(this.id, photoId)
      .subscribe(lastMainPhotoId => {
        this.photos = this.photos.map(photo => {
          if (photo.id === photoId || photo.id === lastMainPhotoId)
            photo.isMain = !photo.isMain;
            
          return photo;
        });
      });
  }
}
