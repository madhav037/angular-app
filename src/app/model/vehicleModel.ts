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
