export interface vehicleDetails {
  id: number;
  name: string;
  model: string;
  year: number;
  images: string[];
  price: number;
  currency: string;
  ageInShowroom: string;
  inStock: boolean;
  shortDescription: string;
  specification: {
    engine: string;
    power: string;
    torque: string;
    fuelType: string;
    transmission: string;
    mileage: string;
    topSpeed: string;
    acceleration: string;
    seating: number;
    bodyType: string;
    drivetrain: string;
  };
  dimension: {
    length: string;
    width: string;
    height: string;
    wheelbase: string;
    bootSpace: string;
  };
  features: string[];
  detailedDescription: string;
}

export interface VehicleFilterDto {
  search?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface VehicleFormValue {
  id: number | null;
  name: string;
  model: string;
  year: number;
  images: string[];
  price: number;
  currency: string;
  ageInShowroom: string;
  inStock: boolean;
  shortDescription: string;
  detailedDescription: string;
  features: string[];
  specification: vehicleDetails['specification'];
  dimension: vehicleDetails['dimension'];
}


export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
];

export const bodyTypeTypes  = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Coupe', 'Wagon', 'Van', 'Truck'];
export const drivetrainTypes = ['FWD', 'RWD', 'AWD', '4WD'];