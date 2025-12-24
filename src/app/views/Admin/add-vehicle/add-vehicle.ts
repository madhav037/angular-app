import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, RequiredValidator, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { bodyTypeTypes, drivetrainTypes, vehicleDetails } from '../../../shared/model/vehicleModel';
import { Auth } from '../../../services/auth';
import { Vehicle } from '../../../services/vehicle';
import { ToastService } from '../../../services/toast';
import { NgIf, NgForOf } from '@angular/common';


@Component({
  selector: 'app-add-vehicle',
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  templateUrl: './add-vehicle.html',
  styleUrl: './add-vehicle.css',
})
export class AddVehicle implements OnInit {
  isEditMode: boolean = false;
  vehicleId: number | null = null;

  private route = inject(ActivatedRoute);
  private vehicleService = inject(Vehicle);
  private toastService = inject(ToastService);

  bodyTypeTypes = bodyTypeTypes;
  driveTrainTypes = drivetrainTypes;

  specificationsForm = new FormGroup({
    engine: new FormControl('', [Validators.required]),
    power: new FormControl('', [Validators.required]),
    torque: new FormControl('', [Validators.required]),
    fuelType: new FormControl('', [Validators.required]),
    transmission: new FormControl('', [Validators.required]),
    mileage: new FormControl('', [Validators.required]),
    topSpeed: new FormControl('', [Validators.required]),
    acceleration: new FormControl('', [Validators.required]),
    seating: new FormControl(0, [Validators.required]),
    bodyType: new FormControl('Sedan', [Validators.required]),
    drivetrain: new FormControl('FWD', [Validators.required]),
  });

  dimensionsForm = new FormGroup({
    length: new FormControl('', [Validators.required]),
    width: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    wheelbase: new FormControl('', [Validators.required]),
    bootSpace: new FormControl('', [Validators.required]),
  });

  form = new FormGroup({
    id: new FormControl(0, [Validators.required]),
    name: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    year: new FormControl(new Date().getFullYear(), [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    currency: new FormControl('INR', [Validators.required]),
    ageInShowroom: new FormControl('', [Validators.required]),
    inStock: new FormControl(true, [Validators.required]),
    shortDescription: new FormControl('', [Validators.required]),
    detailedDescription: new FormControl('', [Validators.required]),
    images: new FormControl<string[]>([], [Validators.required]),
    features: new FormControl<string[]>([], [Validators.required]),
    specification: this.specificationsForm,
    dimension: this.dimensionsForm,
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.vehicleId = Number(params.get('id'));
      this.isEditMode = !!this.vehicleId;
    });

    if (this.isEditMode) {
      this.vehicleService.getVehicleById(this.vehicleId!).subscribe({
        next: (data: vehicleDetails) => {
          this.form.patchValue(data);
          console.log('Vehicle data loaded for editing:', data);
        },
        error: (err: any) => {
          this.toastService.show("Failed to load vehicle data for editing", 'error');
          console.error(`Failed to load vehicle data: ${err.message}`);
        },
      });
    }
  }
}
