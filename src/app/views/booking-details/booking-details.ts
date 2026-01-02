import { Component, inject, OnInit, signal } from '@angular/core';
import { Booking } from '../../services/booking';
import { Auth } from '../../services/auth';
import { DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { ToastService } from '../../services/toast';
import { Vehicle } from '../../services/vehicle';
import { BookingModel, BookingStatus, BookingWithVehicle } from '../../shared/model/bookingModel';
import { vehicleDetails } from '../../shared/model/vehicleModel';
import { forkJoin, switchMap, map, Observable, filter } from 'rxjs';
import { User } from '../../shared/model/userModel';


@Component({
  selector: 'app-booking-details',
  imports: [NgIf, NgFor, DatePipe, NgClass],
  templateUrl: './booking-details.html',
  styleUrl: './booking-details.css',
})
export class BookingDetails implements OnInit {
  private bookingService = inject(Booking);
  private authService = inject(Auth);
  private toastService = inject(ToastService);
  private vehicleService = inject(Vehicle);

  userId = signal<number>(0);
  isUserAdmin = this.authService.isUserAdmin();
  bookingsWithVehicles = signal<BookingWithVehicle[]>([]);

  ngOnInit(): void {
    this.authService
      .getUser$()
      .pipe(
        switchMap((user) => this.bookingService.getBookingsByUserId(user?.id!)),
        switchMap((bookings) =>
          forkJoin(
            bookings.map((b) =>
              this.vehicleService
                .getVehicleById(b.vehicleId)
                .pipe(map((vehicle) => ({ booking: b, vehicle })))
            )
          )
        )
      )
      .subscribe({
        next: (result) => {
          const filteredResult = result.filter(item => item.booking.status !== BookingStatus.CANCELLED)
          this.bookingsWithVehicles.set(filteredResult);
          console.log('Bookings with vehicles:', result);
        },
        error: () => {
          this.toastService.show('Failed to load bookings', 'error');
        },
      });
  }

  formatTime(date: string, time: string): Date {
    return new Date(`${date}T${time}`);
  }
}
