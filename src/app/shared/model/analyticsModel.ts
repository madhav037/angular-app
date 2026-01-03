export interface AnalyticsData {
  totalUsers: number;
  totalVehicles: number;
  totalBookings: number;
  mostActiveBookingDate: string;
  peakBookingSlot: string;
  totalSlotBookedPerSlot: { [slot: string]: number };
}

export interface VehicleAnalytics {
  mostBookedVehicleId: number;
  bookingCount: number;
  mostBookedVehicleName?: string;
}

export interface VehicleBookingStats {
    vehicleName: string;
    totalBookings: number;
    totalCancellations: number;
}



export interface MonthlyAnalytics {
  month: number;
  year: number;
  totalBookings: number;
  totalCancellations: number;
  mostBookedVehicleId: number;
}
