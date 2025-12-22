import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CurrencyPipe, UpperCasePipe, NgIf, AsyncPipe } from '@angular/common';
import { Vehicle } from '../../services/vehicle';
import { Navbar } from '../navbar/navbar';
import { ToastService } from '../../services/toast';
import { vehicleDetails, VehicleFilterDto } from '../../model/vehicleModel';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BehaviorSubject, debounceTime, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [
    Navbar,
    RouterLink,
    CurrencyPipe,
    UpperCasePipe,
    FormsModule,
    MatSliderModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private vehicleService = inject(Vehicle);
  private toast = inject(ToastService);

  vehicles: vehicleDetails[] = [];
  filteredVehicles = signal<vehicleDetails[]>([]);
  numberOfVehicles = computed(() => this.filteredVehicles().length);

  loading$ = new BehaviorSubject<boolean>(true);

  searchTerm = '';
  stockFilter = '';
  year = 0;
  priceRange = { start: 100000, end: 10000000 };

  private filterChange$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadAllVehicles();

    this.filterChange$.pipe(debounceTime(800), takeUntil(this.destroy$)).subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChanged() {
    this.filterChange$.next();
  }

  private loadAllVehicles() {
    this.loading$.next(true);

    this.vehicleService.getVehicles().subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.filteredVehicles.set(vehicles);
        this.loading$.next(false);
      },
      error: (err) => {
        this.toast.show(`Failed to load vehicles ${err.message}`, 'error');
        this.loading$.next(false);
      },
    });
  }

  applyFilters() {
    if (!this.hasActiveFilters()) {
      this.filteredVehicles.set(this.vehicles);
      return;
    }

    const filter: VehicleFilterDto = {};

    if (this.searchTerm.trim()) {
      filter.search = this.searchTerm.trim();
    }

    if (this.stockFilter === 'inStock') {
      filter.inStock = true;
    } else if (this.stockFilter === 'outOfStock') {
      filter.inStock = false;
    }

    filter.minPrice = this.priceRange.start;
    filter.maxPrice = this.priceRange.end;

    this.loading$.next(true);

    this.vehicleService.filterVehicles(filter).subscribe({
      next: (vehicles) => {
        this.filteredVehicles.set(vehicles);
        this.loading$.next(false);
      },
      error: (err) => {
        console.error('Filter failed', err);
        this.loading$.next(false);
      },
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.stockFilter = '';
    this.year = 0;
    this.priceRange = { start: 100000, end: 10000000 };
    this.loadAllVehicles();
  }

  private hasActiveFilters(): boolean {
    return (
      this.searchTerm.trim().length > 0 ||
      this.stockFilter !== '' ||
      this.priceRange.start !== 100000 ||
      this.priceRange.end !== 10000000 ||
      this.year > 0
    );
  }

  getLocale(currency: string): string {
    return currency.toUpperCase() === 'INR' ? 'hi-IN' : 'en-US';
  }
}
