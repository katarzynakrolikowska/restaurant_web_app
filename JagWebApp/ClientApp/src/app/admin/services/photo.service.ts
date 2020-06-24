import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Photo } from '../models/photo';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getAll(dishId) {
    return this.http.get(this.baseUrl + 'api/dishes/' + dishId + '/photos')
      .pipe(map((response: Photo[]) => response));
  }

  upload(dishId, file) {
    let formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.baseUrl + 'api/dishes/' + dishId + '/photos', formData)
      .pipe(map((response: Photo) => response));
  }

  updateMainPhoto(dishId, photoId) {
    var url = this.baseUrl + 'api/dishes/' + dishId + '/photos/' + photoId;
    
    return this.http.patch(url, null)
      .pipe(map((response: number) => response));
  }

  delete(photoId, dishId) {
    return this.http.delete(this.baseUrl + 'api/dishes/' + dishId + '/photos/' + photoId);
  }
}
