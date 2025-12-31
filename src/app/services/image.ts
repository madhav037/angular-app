import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../injection.token';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VehicleImageModel } from '../shared/model/vehicleModel';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  http = inject(HttpClient);
  config = inject(APP_CONFIG);

  private readonly baseUrl: string = this.config.apiUrl + '/Image';

  uploadImage(imageData: FormData): Observable<VehicleImageModel> {
    return this.http.post<VehicleImageModel>(`${this.baseUrl}/upload`, imageData);
  }

  deleteImage(imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${imageId}`);
  }
}
