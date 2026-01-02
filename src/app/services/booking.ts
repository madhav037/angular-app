import { inject, Injectable } from '@angular/core';
import { APP_CONFIG } from '../injection.token';
import { Observable } from 'rxjs';
import { AvaliableSlots, BookingModel } from '../shared/model/bookingModel';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BookingModal } from '../views/booking-modal/booking-modal';

@Injectable({
  providedIn: 'root',
})
export class Booking {
  private readonly config = inject(APP_CONFIG);
  private readonly api_url = this.config.apiUrl + '/booking';
  private http = inject(HttpClient);

  getAllBookings(): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.api_url}`);
  }

  getBookingById(bookingId: number): Observable<BookingModel> {
    return this.http.get<BookingModel>(`${this.api_url}/${bookingId}`);
  }

  getBookingsByUserId(userId: number): Observable<BookingModel[]> {
    return this.http.get<BookingModel[]>(`${this.api_url}/user/${userId}`);
  }

  getAvaliableSlots(date: string): Observable<AvaliableSlots[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<AvaliableSlots[]>(`${this.api_url}/slots`, { params });
  }

  createBooking(bookingData: BookingModel): Observable<BookingModel> {
    return this.http.post<BookingModel>(`${this.api_url}/create`, bookingData);
  }

  updateBooking(bookingId: number, bookingData: BookingModel) {
    return this.http.put(`${this.api_url}/update/${bookingId}`, bookingData);
  }

  cancelBooking(bookingId: number) {
    return this.http.delete(`${this.api_url}/delete/${bookingId}`);
  }
}
