import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../injection.token';
import { Observable } from 'rxjs';
import {
  AnalyticsData,
  MonthlyAnalytics,
  VehicleAnalytics,
  VehicleBookingStats,
} from '../shared/model/analyticsModel';

@Injectable({
  providedIn: 'root',
})
export class analyticsService {
  private http = inject(HttpClient);
  private config = inject(APP_CONFIG);

  private apiUrl = this.config.apiUrl + '/Analytics';

  getSystemAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(`${this.apiUrl}/system-summary`);
  }

  getMostBookedVehicleAnalytics(): Observable<VehicleAnalytics> {
    return this.http.get<VehicleAnalytics>(`${this.apiUrl}/most-booked-vehicle`);
  }

  getMonthlyAnalytics(year: number): Observable<MonthlyAnalytics[]> {
    return this.http.get<MonthlyAnalytics[]>(`${this.apiUrl}/monthly-analytics/${year}`);
  }

  getVehicleBookingStats(vehicleId: number): Observable<VehicleBookingStats> {
    return this.http.get<VehicleBookingStats>(
      `${this.apiUrl}/vehicle-booking-stats/${vehicleId}`
    );
  }

  getCurrentMonthAnalytics(): Observable<MonthlyAnalytics> {
    return this.http.get<MonthlyAnalytics>(`${this.apiUrl}/current-month-analytics`);
  }
}
