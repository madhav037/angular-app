import { Component, effect, inject, Inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AvaliableSlots, BookingModel, BookingStatus } from '../../shared/model/bookingModel';
import { MatFormField, MatFormFieldControl, MatHint, MatLabel } from '@angular/material/form-field';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatCard } from '@angular/material/card';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { Booking } from '../../services/booking';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-booking-modal',
  imports: [
    MatDatepickerModule,
    NgIf,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    DatePipe,
  ],
  templateUrl: './booking-modal.html',
  styleUrl: './booking-modal.css',
})
export class BookingModal implements OnInit {
  selectedDate!: Date;
  avaliableSlots: WritableSignal<AvaliableSlots[]> = signal([]);
  loading: WritableSignal<boolean> = signal(false);
  today: Date = new Date();
  selectedSlot: WritableSignal<AvaliableSlots | null> = signal(null);
  selectedSlotIndex: WritableSignal<number | null> = signal(null);
  vehicleId!: number;
  userId!: number;

  constructor(private dialogRef: MatDialogRef<BookingModal>) {
    effect(() => {
      console.log('Loading state changed:', this.loading());
    });
  }
  private data = inject(MAT_DIALOG_DATA);
  private bookingService = inject(Booking);
  private authService = inject(Auth);

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.vehicleId = this.data.vehicleId;
    console.log('Vehicle ID in booking modal:', this.vehicleId);
    this.authService.getUser$().subscribe((user) => {
      if (user) {
        this.userId = user.id!;
        console.log('Current user ID:', this.userId);
      } else {
        console.log('No user is currently logged in.');
      }
    });
  }

  onDateSelected(date: Date) {
    this.selectedDate = date;
    console.log('Selected date:', this.selectedDate);
    console.log('ISO Date:', this.selectedDate.toLocaleDateString('en-CA'));
    this.loadSlots();
  }

  loadSlots() {
    this.loading.set(true);

    this.bookingService
      .getAvaliableSlots(this.selectedDate.toLocaleDateString('en-CA'))
      .subscribe((slots: AvaliableSlots[]) => {
        this.avaliableSlots.set(slots);
        this.loading.set(false);
        console.log('Avaliable slots:', this.avaliableSlots());
      });
  }

  selectSlot(slot: AvaliableSlots, index: number) {
    if (slot.availableSpots === 0) return;
    this.selectedSlot.set(slot);
    this.selectedSlotIndex.set(index);
    console.log('Selected slot:', this.selectedSlot());
  }

  close(result: boolean) {
    if (!result || !this.selectedSlot()) {
      this.dialogRef.close(null);
      return;
    }
    if (
      confirm(
        `Confirm booking for ${this.selectedDate.toLocaleDateString(
          'en-GB'
        )} - Slot: ${this.selectedSlotIndex()}`
      )
    ) {
      const payload: BookingModel = {
        vehicleId: this.vehicleId,
        userId: this.userId,
        bookingDate: this.selectedDate.toLocaleDateString('en-CA'),
        slot: this.selectedSlot()!.slot as any,
        status: BookingStatus.CONFIRMED,
        bookingStartTime: this.selectedSlot()!.bookingStartTime,
        bookingEndTime: this.selectedSlot()!.bookingEndTime,
      };
      this.dialogRef.close(payload);
    }
  }
}

/*
constructor(private dialog: MatDialog) {}

openConfirm() {
  this.dialog.open(ConfirmDialog, {
    data: { slot: 'SLOT_9_11' }
  }).afterClosed().subscribe(result => {
    if (result) {
      this.bookSlot();
    }
  });
}
*/
