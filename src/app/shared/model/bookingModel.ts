import { User } from "./userModel";
import { vehicleDetails } from "./vehicleModel";

export interface BookingModel {
  bookingId?: number | null;
  vehicleId: number;
  userId: number;
  bookingDate: string; // ISO date string
  slot: BookingSlotKey;
  status: BookingStatus;
  bookingStartTime: string; // ISO date-time string
  bookingEndTime: string; // ISO date-time string
}

export interface AvaliableSlots {
  bookingDate: string; // ISO date string
  slot: BookingSlotKey;
  bookingStartTime: string; // ISO date-time string
  bookingEndTime: string; // ISO date-time string
  availableSpots: number;
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export type BookingWithVehicle = {
  booking: BookingModel;
  vehicle: vehicleDetails;
  user? : User;
};

export const BOOKING_SLOTS = {
  SLOT_9_11: { start: '09:00', end: '11:00' },
  SLOT_11_13: { start: '11:00', end: '13:00' },
  SLOT_13_15: { start: '13:00', end: '15:00' },
  SLOT_15_17: { start: '15:00', end: '17:00' },
} as const;

export type BookingSlotKey = keyof typeof BOOKING_SLOTS;
