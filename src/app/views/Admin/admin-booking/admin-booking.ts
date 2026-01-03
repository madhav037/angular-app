import { Component, inject, OnInit, signal } from '@angular/core';
import {
  BookingModel,
  BookingStatus,
  BookingWithVehicle,
} from '../../../shared/model/bookingModel';
import { forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Booking } from '../../../services/booking';
import { Auth } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { Vehicle } from '../../../services/vehicle';
import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { vehicleDetails } from '../../../shared/model/vehicleModel';

@Component({
  selector: 'app-admin-booking',
  imports: [NgIf, NgFor, DatePipe],
  templateUrl: './admin-booking.html',
  styleUrl: './admin-booking.css',
})
export class AdminBooking implements OnInit {
  private bookingService = inject(Booking);
  private authService = inject(Auth);
  private toastService = inject(ToastService);
  private vehicleService = inject(Vehicle);

  loading = signal<boolean>(false);
  bookingStatuses = Object.values(BookingStatus);
  bookingsWithVehicles = signal<BookingWithVehicle[]>([]);
  vehicleNamesWithId = signal<{ id: number; vehicleName: string }[]>([]);

  ngOnInit(): void {
    this.vehicleService
      .getVehicleNamesWithId()
      .subscribe((vehicles) => this.vehicleNamesWithId.set(vehicles));

    this.bookingService
      .getAllBookings()
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap((bookings) => {
          if (bookings.length === 0) {
            this.loading.set(false);
            return of([]);
          }
          return forkJoin(
            bookings.map((b) =>
              forkJoin({
                vehicle: this.vehicleService.getVehicleById(b.vehicleId),
                user: this.authService.getUserById(b.userId),
              }).pipe(map(({ vehicle, user }) => ({ booking: b, vehicle, user })))
            )
          );
        })
      )
      .subscribe({
        next: (result) => {
          const sortedResult = result.sort((a, b) => {
            const timeA = new Date(
              `${a.booking.bookingDate}T${a.booking.bookingStartTime}`
            ).getTime();

            const timeB = new Date(
              `${b.booking.bookingDate}T${b.booking.bookingStartTime}`
            ).getTime();

            return timeB - timeA;
          });
          this.bookingsWithVehicles.set(sortedResult);
          this.loading.set(false);
          console.log('Bookings with vehicles:', result);
        },
        error: () => {
          this.toastService.show('Failed to load bookings', 'error');
          this.loading.set(false);
        },
      });
  }

  isUpcomingAndStatusCorrect(item: BookingWithVehicle): boolean {
    const targetStatus = this.bookingStatuses[this.bookingStatuses.length - 3];

    if (item.booking.status !== targetStatus) {
      return false;
    }

    const bookingDateTime = new Date(
      `${item.booking.bookingDate}T${item.booking.bookingStartTime}`
    );

    return bookingDateTime > new Date();
  }

  formatTime(date: string, time: string): Date {
    return new Date(`${date}T${time}`);
  }

  updateBookingDetails(item: BookingWithVehicle, event: Event, type: 'status' | 'vehicle') {
    const select = event.target as HTMLSelectElement;
    console.log('Selected value:', select.value);
    const booking = item.booking;
    let oldConfig = "";
    if (type === 'status') {
      const newStatus = select.value as BookingStatus;
      oldConfig = booking.status;
      booking.status = newStatus;
    } else if (type === 'vehicle') {
      this.vehicleService.getVehicleById(Number(select.value)).subscribe({
        next: (vehicle: vehicleDetails) => {
          item.vehicle = vehicle;
        },
        error: () => {
          this.toastService.show('Failed to fetch vehicle details', 'error');
        },
      });
      const newVehicleId = Number(select.value);
      booking.vehicleId = newVehicleId;
    }
    this.bookingService.updateBooking(booking.bookingId!, booking).subscribe({
      next: () => {
        this.toastService.show('Booking status updated successfully', 'success');
      },
      error: () => {
        this.toastService.show('Failed to update booking status', 'error');
       booking.status = oldConfig as BookingStatus;
      },
    });
  }

  deleteBooking(bookingId: number) {
    this.bookingService.cancelBooking(bookingId).subscribe({
      next: () => {
        this.bookingsWithVehicles.set(
          this.bookingsWithVehicles().filter((item) => item.booking.bookingId !== bookingId)
        );
        this.toastService.show('Booking deleted successfully', 'success');
      },
      error: () => {
        this.toastService.show('Failed to delete booking', 'error');
      },
    });
  }
}
