/// <reference types="cypress" />

describe('dashboard', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
    cy.loginAsAdmin();
    cy.setCookie('refreshToken', 'fake-refresh-token');
    cy.visit('http://localhost:4200/dashboard');

    cy.intercept('GET', '**/Vehicle/getall-paged?pageNumber=1&pageSize=5', {
      statusCode: 200,
      body: mockVehicles,
      headers: {
        'X-Has-Next-Page': 'true',
      },
    }).as('getVehicles');
  });

  it('should load vehicles on dashboard', () => {
    cy.wait('@getVehicles').its('response.statusCode').should('eq', 200);

    cy.contains('Toyota Camry').should('be.visible');
  });

  it('should show correct number of vehicles', () => {
    cy.wait('@getVehicles');
    cy.contains('Showing 2 vehicles');
  });
});

const mockVehicles = [
  {
    id: 1,
    name: 'Toyota Camry',
    model: 'Hybrid LE',
    year: 2024,
    images: [
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764249945/Gemini_Generated_Image_bmmrprbmmrprbmmr_3_qndtkg.png',
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764249944/Gemini_Generated_Image_bmmrprbmmrprbmmr_df7cbs.png',
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764249929/Gemini_Generated_Image_bmmrprbmmrprbmmr_2_lfvx4s.png',
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764249881/Gemini_Generated_Image_bmmrprbmmrprbmmr_1_blhybs.png',
    ],
    price: 2500000,
    currency: 'INR',
    ageInShowroom: '3 months',
    inStock: true,
    shortDescription:
      'The Toyota Camry Hybrid combines luxury with fuel efficiency, featuring advanced safety systems and a spacious interior.',
    specifications: {
      engine: '2.5L 4-Cylinder Hybrid',
      power: '208 HP',
      torque: '221 Nm',
      fuelType: 'Hybrid (Petrol + Electric)',
      transmission: 'CVT Automatic',
      mileage: '23 km/l',
      topSpeed: '180 km/h',
      acceleration: '8.3 seconds (0-100 km/h)',
      seating: 5,
      bodyType: 'Sedan',
      drivetrain: 'FWD',
    },
    dimensions: {
      length: '4885 mm',
      width: '1840 mm',
      height: '1445 mm',
      wheelbase: '2825 mm',
      bootSpace: '524 liters',
    },
    features: [
      'Adaptive Cruise Control',
      'Lane Departure Warning',
      '9-inch Touchscreen Infotainment',
      'Apple CarPlay & Android Auto',
      'Leather Upholstery',
      'Dual-zone Climate Control',
      '8 Airbags',
    ],
    detailedDescription:
      'The 2024 Toyota Camry Hybrid LE represents the perfect blend of sophistication, efficiency, and reliability...',
  },
  {
    id: 2,
    name: 'Hyundai Creta',
    model: 'SX (O) Turbo',
    year: 2024,
    images: [
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764250205/Gemini_Generated_Image_37o9bo37o9bo37o9_xknhzj.png',
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764250213/Gemini_Generated_Image_qixiw2qixiw2qixi_na6jxo.png',
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764250213/Gemini_Generated_Image_i5tcl4i5tcl4i5tc_l6ae6l.png',
      'https://res.cloudinary.com/dwlm1th2p/image/upload/v1764250216/Gemini_Generated_Image_27zadb27zadb27za_u11drn.png',
    ],
    price: 1850000,
    currency: 'USD',
    ageInShowroom: '1 month',
    inStock: true,
    shortDescription:
      'The 2024 Creta Turbo offers a powerful drive with premium interiors and modern tech.',
    specifications: {
      engine: '1.5L Turbo GDi',
      power: '160 HP',
      torque: '253 Nm',
      fuelType: 'Petrol',
      transmission: '7-Speed DCT',
      mileage: '18 km/l',
      topSpeed: '195 km/h',
      acceleration: '8.9 seconds',
      seating: 5,
      bodyType: 'SUV',
      drivetrain: 'FWD',
    },
    dimensions: {
      length: '4300 mm',
      width: '1790 mm',
      height: '1635 mm',
      wheelbase: '2610 mm',
      bootSpace: '433 liters',
    },
    features: [
      'Panoramic Sunroof',
      'Ventilated Seats',
      'ADAS Level 1',
      '10.25-inch Infotainment',
      'Wireless Charging',
      'Ambient Lighting',
      '6 Airbags',
    ],
    detailedDescription:
      'The Hyundai Creta Turbo SX (O) is engineered for thrill seekers who demand premium features...',
  },
];
