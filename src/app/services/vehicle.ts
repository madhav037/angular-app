import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { vehicleDetails } from '../model/vehicleModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Vehicle {
  http = inject(HttpClient);
  router = inject(Router);

  readonly baseApiUrl = environment.APIURL + '/vehicleDetails';

  getVehicles(): Observable<vehicleDetails[]> {
    return this.http.get<vehicleDetails[]>(`${this.baseApiUrl}`);
  }

  getVehicleById(id: number): Observable<vehicleDetails> {
    return this.http.get<vehicleDetails>(`${this.baseApiUrl}/${id}`);
  }

  searchVehicles(category: 'name' | 'model', query: string) {
    return this.http.get(`${this.baseApiUrl}?_fields=${category}`);
  }
}
