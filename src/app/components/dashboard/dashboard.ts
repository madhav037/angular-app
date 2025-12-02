import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { Vehicle } from '../../services/vehicle';
import { Navbar } from '../navbar/navbar';
import { ToastService } from '../../services/toast';
import { vehicleDetails } from '../../model/vehicleModel';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'app-dashboard',
  imports: [Navbar, RouterLink, CurrencyPipe, UpperCasePipe, FormsModule, MatSliderModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private vehicleService = inject(Vehicle);
  private toast = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  vehicles: vehicleDetails[] = [];
  filteredVehicles: vehicleDetails[] = [];

  searchTerm: string = '';
  stockFilter: string = '';
  priceRange = { start: 100000, end: 10000000 };
  sortBy: string = 'newest';

  constructor() {
    // console.log('Dashboard initialized');
    // this.vehicleService.getVehicles().subscribe({
    //   next: (v: vehicleDetails[]) => {
    //     console.log('Vehicles loaded:', v);
    //     this.vehicles = v;
    //     this.filteredVehicles = v;
    //   },
    //   error: (err: any) => {
    //     this.toast.show(`Failed to load vehicles ${err.message}`, 'error' );
    //     this.vehicles = [];
    //   },
    // });
  }

  getLocale(currency: string): string {
    currency = currency.toUpperCase();

    if (currency === 'INR') return 'hi-IN';
    return 'en-US';
  }

  ngOnInit(): void {
    console.log('Dashboard initialized');
    this.vehicleService.getVehicles().subscribe({
      next: (v: vehicleDetails[]) => {
        console.log('Vehicles loaded:', v);
        this.vehicles = v;
        this.filteredVehicles = v;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.toast.show(`Failed to load vehicles ${err.message}`, 'error');
        this.vehicles = [];
      },
    });
  }

  // ngDoCheck() {
  //   this.applyFilters();
  // }

  applyFilters() {
    let results = [...this.vehicles];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      results = results.filter(
        (vehicle) =>
          vehicle.name.toLowerCase().includes(term) ||
          vehicle.model.toLowerCase().includes(term) ||
          vehicle.year.toString().includes(term)
      );
    }

    if (this.stockFilter === 'inStock') {
      results = results.filter((v) => v.inStock === true);
    } else if (this.stockFilter === 'outOfStock') {
      results = results.filter((v) => v.inStock === false);
    }

    if (this.priceRange) {
      console.log('Applying price filter:', this.priceRange);
      results = results.filter(
        (v) => v.price >= this.priceRange.start && v.price <= this.priceRange.end
      );
    }

    this.filteredVehicles = results;
    this.cdr.detectChanges();
  }

  clearFilters() {
    this.searchTerm = '';
    this.stockFilter = '';
    this.priceRange = { start: 100000, end: 10000000 };
    this.sortBy = 'newest';
    this.filteredVehicles = [...this.vehicles];
    this.cdr.detectChanges();
  }
}
