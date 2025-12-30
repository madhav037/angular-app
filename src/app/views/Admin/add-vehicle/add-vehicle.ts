import { Component, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  RequiredValidator,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  bodyTypeTypes,
  drivetrainTypes,
  fuelTypes,
  vehicleDetails,
  VehicleImageModel,
} from '../../../shared/model/vehicleModel';
import { Auth } from '../../../services/auth';
import { Vehicle } from '../../../services/vehicle';
import { ToastService } from '../../../services/toast';
import { NgIf, NgForOf } from '@angular/common';
import { ImageService } from '../../../services/image.ts';

@Component({
  selector: 'app-add-vehicle',
  imports: [ReactiveFormsModule, NgIf, NgForOf, FormsModule],
  templateUrl: './add-vehicle.html',
  styleUrl: './add-vehicle.css',
})
export class AddVehicle implements OnInit {
  isEditMode: boolean = false;
  vehicleId: number | null = null;
  selectedFiles: File[] | [] = [];
  previewUrls: WritableSignal<VehicleImageModel[]> = signal([]);
  imageUploadingInProgress: WritableSignal<boolean> = signal(false);
  featureString: string = '';

  private route = inject(ActivatedRoute);
  private vehicleService = inject(Vehicle);
  private toastService = inject(ToastService);
  private imageService = inject(ImageService);
  private router = inject(Router);

  bodyTypeTypes = bodyTypeTypes;
  driveTrainTypes = drivetrainTypes;
  fuelTypes = fuelTypes;

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
    bodyType: new FormControl('', [Validators.required]),
    drivetrain: new FormControl('', [Validators.required]),
  });

  dimensionsForm = new FormGroup({
    length: new FormControl('', [Validators.required]),
    width: new FormControl('', [Validators.required]),
    height: new FormControl('', [Validators.required]),
    wheelbase: new FormControl('', [Validators.required]),
    bootSpace: new FormControl('', [Validators.required]),
  });

  form = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    year: new FormControl(new Date().getFullYear(), [
      Validators.required,
      Validators.max(new Date().getFullYear()),
    ]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    currency: new FormControl('INR', [Validators.required]),
    ageInShowroom: new FormControl('', [Validators.required]),
    inStock: new FormControl(true, [Validators.required]),
    shortDescription: new FormControl('', [Validators.required]),
    detailedDescription: new FormControl('', [Validators.required]),
    images: new FormControl<VehicleImageModel[]>([], [Validators.required, Validators.minLength(1)]),
    features: new FormControl<string[]>([], [Validators.required, Validators.minLength(1)]),
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
          this.form.get('ageInShowroom')?.setValue(data.ageInShowroom.split(' ')[0]);
          console.log('Patching form with data:', data.ageInShowroom);
          this.featureString = data.features.join(', ');
          this.previewUrls.set(data.images);
          
          console.log('Vehicle data loaded for editing:', data);
        },
        error: (err: any) => {
          this.toastService.show('Failed to load vehicle data for editing', 'error');
          console.error(`Failed to load vehicle data: ${err.message}`);
        },
      });
    }
  }

  convertFeaturesToList(feature: string) {
    return feature
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);
  }

  updateFeatureString(event: Event) {
    const input = event.target as HTMLInputElement;
    this.featureString = input.value;
    console.log('Feature string updated:', this.featureString);
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.selectedFiles = Array.from(input.files);
  }

  uploadImages(index = 0) {
    if (index >= this.selectedFiles!.length) {
      this.toastService.show('All images uploaded', 'success');
      this.imageUploadingInProgress.set(false);
      return;
    }

    this.imageUploadingInProgress.set(true);
    const file = this.selectedFiles![index];
    const formData = new FormData();
    formData.append('file', file);

    this.imageService.uploadImage(formData).subscribe({
      next: (res: VehicleImageModel) => {
        console.log('Image uploaded:', res);
        const currentImages = this.form.get('images')?.value || [];
        this.form.get('images')?.setValue([...currentImages, res]);
        this.previewUrls.update((urls: VehicleImageModel[]) => [
          ...urls,
          { imageUrl: res.imageUrl, publicId: res.publicId },
        ]);
        this.toastService.show(`Uploaded ${file.name} successfully`, 'success');

        this.uploadImages(index + 1);
      },
      error: () => {
        this.toastService.show(`Failed to upload ${file.name}`, 'error');
        this.imageUploadingInProgress.set(false);
      },
    });
  }

  removeVehicleImage(imageUrl: VehicleImageModel, index: number) {
    if (!confirm('Are you sure you want to remove this image?')) return;

    this.imageService.deleteImage(imageUrl.publicId!).subscribe({
      next: () => {
        this.previewUrls.update((urls: VehicleImageModel[]) => urls.filter((_, i) => i !== index));

        const currentImages = this.form.get('images')?.value || [];
        const updatedImages = currentImages.filter((img: VehicleImageModel) => img.imageUrl !== imageUrl.imageUrl);
        this.form.get('images')?.setValue(updatedImages);

        this.toastService.show('Image removed successfully', 'success');
      },
      error: () => {
        this.toastService.show('Failed to remove image', 'error');
      },
    });
  }

  onSubmit() {
    this.form.patchValue({ features: this.convertFeaturesToList(this.featureString) });

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.invalid) {
          console.log(key, control.errors, control.value);
        }
      });
      this.toastService.show('Please fill all required fields', 'error');
      return;
    }

    const payload: vehicleDetails = {
      id: this.vehicleId || 0,
      name: this.form.value.name!,
      model: this.form.value.model!,
      year: this.form.value.year!,
      images: this.form.value.images!,
      price: this.form.value.price!,
      currency: this.form.value.currency!,
      ageInShowroom: this.form.value.ageInShowroom! + ' Months',
      inStock: this.form.value.inStock!,
      shortDescription: this.form.value.shortDescription!,
      specification: {
        engine: this.form.value.specification!.engine!,
        power: this.form.value.specification!.power!,
        torque: this.form.value.specification!.torque!,
        fuelType: this.form.value.specification!.fuelType!,
        transmission: this.form.value.specification!.transmission!,
        mileage: this.form.value.specification!.mileage!,
        topSpeed: this.form.value.specification!.topSpeed!,
        acceleration: this.form.value.specification!.acceleration!,
        seating: this.form.value.specification!.seating!,
        bodyType: this.form.value.specification!.bodyType!,
        drivetrain: this.form.value.specification!.drivetrain!,
      },
      dimension: {
        length: this.form.value.dimension!.length!,
        width: this.form.value.dimension!.width!,
        height: this.form.value.dimension!.height!,
        wheelbase: this.form.value.dimension!.wheelbase!,
        bootSpace: this.form.value.dimension!.bootSpace!,
      },
      features: this.form.value.features!,
      detailedDescription: this.form.value.detailedDescription!,
    };

    if (this.isEditMode) {
      this.vehicleService.editVehicle(this.vehicleId!, payload).subscribe({
        next: (response: vehicleDetails) => {
          this.toastService.show('Vehicle updated successfully', 'success');
          const id = response.id;
          this.form.reset();
          this.previewUrls.set([]);
          this.selectedFiles = [];
          this.router.navigate(['/vehicles', id]);
        },
        error: (err: any) => {
          this.toastService.show('Failed to update vehicle', 'error');
          console.error(`Failed to update vehicle: ${err.message}`);
        }
      });
      return;
    }

    this.vehicleService.createVehicle(payload).subscribe({
      next: (response: vehicleDetails) => {
        this.toastService.show('Vehicle created successfully', 'success');
        const id = response.id;
        this.form.reset();
        this.previewUrls.set([]);
        this.selectedFiles = [];
        this.router.navigate(['/vehicles', id]);
      },
      error: (err: any) => {
        this.toastService.show('Failed to create vehicle', 'error');
        console.error(`Failed to create vehicle: ${err.message}`);
      },
    });

    console.log('Form submitted with value:', this.form.value);
  }
}
