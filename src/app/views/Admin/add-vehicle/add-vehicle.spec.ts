import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVehicle } from './add-vehicle';
import { APP_CONFIG } from '../../../injection.token';
import { ActivatedRoute } from '@angular/router';

describe('AddVehicle', () => {
  let component: AddVehicle;
  let fixture: ComponentFixture<AddVehicle>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicle],
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
            snapshot: {},
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddVehicle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
