import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDetails } from './vehicle-details';
import { APP_CONFIG } from '../../injection.token';
import { ActivatedRoute } from '@angular/router';

describe('VehicleDetails', () => {
  let component: VehicleDetails;
  let fixture: ComponentFixture<VehicleDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleDetails],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            apiUrl: 'http://localhost:5000/api',
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
            },
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
