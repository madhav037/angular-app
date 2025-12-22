import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { vehicleDetails, VehicleFilterDto } from '../model/vehicleModel';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../injection.token';

@Injectable({
  providedIn: 'root',
})
export class Vehicle {
  http = inject(HttpClient);
  router = inject(Router);

  private _appConfig = inject(APP_CONFIG);
  readonly baseApiUrl = this._appConfig.apiUrl + '/Vehicle';

  getVehicles(): Observable<vehicleDetails[]> {
    return this.http.get<vehicleDetails[]>(`${this.baseApiUrl}`);
  }

  getVehicleById(id: number): Observable<vehicleDetails> {
    return this.http.get<vehicleDetails>(`${this.baseApiUrl}/${id}`);
  }

  filterVehicles(filter: VehicleFilterDto) {
    let params = new HttpParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<any[]>(`${this.baseApiUrl}/filter`, { params });
  }
}
