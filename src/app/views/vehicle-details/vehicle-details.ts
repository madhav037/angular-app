import { Component, inject, signal } from '@angular/core';
import { vehicleDetails } from '../../shared/model/vehicleModel';
import { Vehicle } from '../../services/vehicle';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BookingModal } from '../booking-modal/booking-modal';
import { Booking } from '../../services/booking';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-vehicle-details',
  imports: [Navbar, KeyValuePipe, TitleCasePipe, RouterLink],
  templateUrl: './vehicle-details.html',
  styleUrl: './vehicle-details.css',
})
export class VehicleDetails {
  vehicleId: number = 0;
  vehicleData = signal<vehicleDetails | null>(null);

  vehicleService = inject(Vehicle);
  route = inject(ActivatedRoute);
  private bookingService = inject(Booking);
  private toastService = inject(ToastService);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.vehicleId = Number(params.get('id')) || 0;
    });
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (data: vehicleDetails) => {
        this.vehicleData.set(data);
        console.log('Vehicle details loaded:', data);
      },
      error: (err: any) => {
        console.error(`Failed to load vehicle details: ${err.message}`);
        this.vehicleData.set(null);
      },
    });
  }

  openDialog() {
    this.dialog
      .open(BookingModal, { data: { vehicleId: this.vehicleId } })
      .afterClosed()
      .subscribe((result) => {
        if (!result) {
          return;
        }
        console.log('Booking data received from modal:', result);
        this.bookingService.createBooking(result).subscribe({
          next: (data) => {
            console.log('Booking created successfully:', data);
            this.toastService.show('Booking created successfully!', 'success')
          },
          error: (err) => {
            console.error('Error creating booking:', err.message);
            this.toastService.show('Failed to create booking.', 'error');
          },
        });
      });
  }
}
