import { Component, computed, inject, OnDestroy, OnInit, signal, effect } from '@angular/core';
import { CurrencyPipe, UpperCasePipe, NgIf, AsyncPipe } from '@angular/common';
import { Vehicle } from '../../services/vehicle';
import { Navbar } from '../navbar/navbar';
import { ToastService } from '../../services/toast';
import { vehicleDetails, VehicleFilterDto } from '../../shared/model/vehicleModel';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BehaviorSubject, debounceTime, Subject, takeUntil } from 'rxjs';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [
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
  private authService = inject(Auth);

  vehicles: vehicleDetails[] = [];
  filteredVehicles = signal<vehicleDetails[]>([]);
  numberOfVehicles = computed(() => this.filteredVehicles().length);
  hasFilters = signal(false);
  isUserAdmin = signal<boolean>(false);

  loading$ = new BehaviorSubject<boolean>(true);

  currentPage = signal<number>(1);
  itemsPerPage = 5;
  hasNextPage = signal<boolean>(true);

  searchTerm = '';
  stockFilter = '';
  year = 0;
  priceRange = { start: 100000, end: 10000000 };

  private filterChange$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // this.loadAllVehicles();

    this.filterChange$.pipe(debounceTime(800), takeUntil(this.destroy$)).subscribe(() => {
      this.applyFilters();
    });
    this.authService.isUserAdmin().subscribe({
      next: (isAdmin) => {
        this.isUserAdmin.set(isAdmin);
      },
    });
  }

  constructor() {
    effect(() => {
      const page = this.currentPage();
      const filtersActive = this.hasFilters();

      if (filtersActive) {
        this.applyFilters();
      } else {
        this.loadAllVehicles();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChanged() {
    this.hasFilters.set(this.hasActiveFilters());
    this.currentPage.set(1);
    this.filterChange$.next();
  }

  private loadAllVehicles() {
    this.loading$.next(true);

    // this.vehicleService.getVehicles().subscribe({
    //   next: (vehicles) => {
    //     this.vehicles = vehicles;
    //     this.filteredVehicles.set(vehicles);
    //     this.loading$.next(false);
    //   },
    //   error: (err) => {
    //     this.toast.show(`Failed to load vehicles ${err.message}`, 'error');
    //     this.loading$.next(false);
    //   },
    // });
    this.vehicleService.GetPagedVehicles(this.currentPage(), this.itemsPerPage).subscribe({
      next: (response) => {
        this.vehicles = response.body || [];
        this.hasNextPage.set(response.headers.get('X-Has-Next-Page')?.toLowerCase() === 'true');
        // console.log('header = ', response.headers.get('X-Has-Next-Page'));
        // console.log('hasNextPage = ', this.hasNextPage());
        this.filteredVehicles.set(response.body || []);
        this.loading$.next(false);
      },
      error: (err) => {
        this.toast.show(`Failed to load vehicles ${err.message}`, 'error');
        this.loading$.next(false);
      },
    });
  }

  applyFilters() {
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

    this.vehicleService
      .GetFilteredPagedVehicles(filter, this.currentPage(), this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.filteredVehicles.set(response.body || []);
          this.hasNextPage.set(response.headers.get('X-Has-Next-Page')?.toLowerCase() === 'true');
          this.loading$.next(false);
        },
        error: () => this.loading$.next(false),
      });
  }

  clearFilters() {
    this.searchTerm = '';
    this.stockFilter = '';
    this.year = 0;
    this.priceRange = { start: 100000, end: 10000000 };

    this.hasFilters.set(false);
    this.currentPage.set(1);
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

  changePage(state: 'next' | 'prev') {
    if (state == 'next') {
      this.currentPage.update((prev) => prev + 1);
    }
    if (state === 'prev' && this.currentPage() === 1) return;
    if (state == 'prev') {
      this.currentPage.update((prev) => prev - 1);
    }
  }

  deleteVehicle(id: number, name : string) {
    if (confirm(`Are you sure you want to delete vehicle : ${name}?`)) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.toast.show('Vehicle deleted successfully', 'success');
          this.applyFilters();
        },
        error: (err) => {
          this.toast.show(`Failed to delete vehicle: ${err.message}`, 'error');
        },
      });
    }
  }
}
