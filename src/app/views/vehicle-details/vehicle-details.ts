import { Component, inject, signal } from '@angular/core';
import { vehicleDetails } from '../../shared/model/vehicleModel';
import { Vehicle } from '../../services/vehicle';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';

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
}
