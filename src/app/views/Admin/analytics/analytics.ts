import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { analyticsService } from '../../../services/analytics';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import {
  AnalyticsData,
  MonthlyAnalytics,
  VehicleAnalytics,
  VehicleBookingStats,
} from '../../../shared/model/analyticsModel';
import { BOOKING_SLOTS } from '../../../shared/model/bookingModel';
import { Vehicle } from '../../../services/vehicle';
import { A11yModule } from '@angular/cdk/a11y';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData } from 'chart.js';

@Component({
  selector: 'app-analytics',
  imports: [NgFor, AsyncPipe, NgIf, A11yModule, BaseChartDirective],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css',
})
export class Analytics implements OnInit {
  private analyticsService = inject(analyticsService);
  private vehicleService = inject(Vehicle);

  areVehicleStatsAvailable = signal(false);
  areStatsLoading = signal(false);

  barChartData!: ChartData<'bar'>;
  pieChartData!: ChartData<'pie'>;
  barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  systemSummary$!: Observable<AnalyticsData>;
  // currentMonthAnalytics$!: Observable<MonthlyAnalytics>;
  // monthlyAnalytics$!: Observable<MonthlyAnalytics[]>;
  mostBookedVehicle$!: Observable<VehicleAnalytics>;

  vehicleNamesWithId = signal<{ id: number; vehicleName: string }[]>([]);

  ngOnInit(): void {
    this.vehicleService
      .getVehicleNamesWithId()
      .subscribe((vehicles) => this.vehicleNamesWithId.set(vehicles));

    this.systemSummary$ = this.analyticsService.getSystemAnalytics().pipe(
      map((summary) => {
        const bookingSlot = BOOKING_SLOTS[summary.peakBookingSlot as keyof typeof BOOKING_SLOTS];
        console.log('System summary data loaded:', summary.totalSlotBookedPerSlot);
        const labels = Object.keys(BOOKING_SLOTS);

        this.barChartData = {
          labels,
          datasets: [
            {
              label: 'Total Bookings Per Slot',
              data: labels.map((slot) => summary.totalSlotBookedPerSlot[slot] ?? 0),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
              ],
              borderWidth: 1,
            },
          ],
        };
        this.chart?.update();
        return {
          ...summary,
          mostActiveBookingDate: new Date(summary.mostActiveBookingDate).toDateString(),
          peakBookingSlot: bookingSlot.start + ' - ' + bookingSlot.end,
        };
      })
    );

    // this.currentMonthAnalytics$ = this.analyticsService.getCurrentMonthAnalytics();
    // this.monthlyAnalytics$ = this.analyticsService.getMonthlyAnalytics(new Date().getFullYear());
    this.mostBookedVehicle$ = this.analyticsService.getMostBookedVehicleAnalytics().pipe(
      switchMap((vehicleStats) => {
        if (!vehicleStats.mostBookedVehicleId) {
          return of({
            ...vehicleStats,
            mostBookedVehicleName: 'Unknown Vehicle',
          });
        }

        return this.vehicleService.getVehicleById(vehicleStats.mostBookedVehicleId).pipe(
          map((vehicle) => ({
            ...vehicleStats,
            mostBookedVehicleName: vehicle?.name ?? 'Unknown Vehicle',
          }))
        );
      })
    );
  }

  changeVehicleStat(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const vehicleId = Number(selectElement.value);
    this.areStatsLoading.set(true);

    this.analyticsService
      .getVehicleBookingStats(vehicleId)
      .subscribe((stats: VehicleBookingStats) => {
        if (!stats || stats.totalBookings === 0) {
          this.areVehicleStatsAvailable.set(false);
          console.log('No booking stats available for vehicle ID', vehicleId);
          return;
        }
        this.areVehicleStatsAvailable.set(true);
        this.pieChartData = {
          labels: ['Confirmed Bookings', 'Cancellations'],
          datasets: [
            {
              label: 'Bookings Statistics',
              data: [stats.totalBookings - stats.totalCancellations, stats.totalCancellations],
              backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
              hoverOffset: 4,
            },
          ],
        };
        this.chart?.update();
        this.areStatsLoading.set(false);
        console.log('Vehicle booking stats loaded for vehicle ID', vehicleId, stats);
      });
  }
}

/* 
month wise, all year,   
bookings : 
  month wise : bookings per day, bookings per slot per day, total bookings, cancellations
  all year : total bookings, cancellations


vehicle wise :
  month wise : most booked vehicle (top 5), least booked vehicle (top 5)
  all year : 

system wise :
  total users
  total vehicles
  total bookings
  peak booking slot  

overall
  overall slot popularity : bar chart slot wise
  booking date popularity : line chart date wise
  

month
  bookings & cancellations per month : pie chart

*/
