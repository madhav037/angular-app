import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { Auth } from '../../services/auth';
import { Vehicle } from '../../services/vehicle';
import { ToastService } from '../../services/toast';
import { APP_CONFIG } from '../../injection.token';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('Dashboard', () => {
  let dashboard: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const authMock = {
    isUserAdmin: vi.fn(),
  };

  const APP_CONFIGMock = {
    apiUrl: 'http://localhost:5000/api',
  };

  const vehicleMock = {
    GetPagedVehicles: vi.fn(),
    GetFilteredPagedVehicles: vi.fn(),
    deleteVehicle: vi.fn(),
  };

  const toastMock = {
    show : vi.fn(),
  };

  vehicleMock.GetPagedVehicles.mockReturnValue(
    of(
      new HttpResponse({
        body: [],
        headers: new Headers({ 'X-Has-Next-Page': 'false' }) as any,
      })
    )
  );

  vehicleMock.GetFilteredPagedVehicles.mockReturnValue(
    of(
      new HttpResponse({
        body: [],
        headers: new Headers({ 'X-Has-Next-Page': 'false' }) as any,
      })
    )
  );


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: Vehicle, useValue: vehicleMock },
        { provide: ToastService, useValue: toastMock },
        { provide: APP_CONFIG, useValue: APP_CONFIGMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    dashboard = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should change isUserAdmin to true', () => {
    authMock.isUserAdmin.mockReturnValue(of(true));

    dashboard.ngOnInit();

    expect(dashboard.isUserAdmin()).toBe(true);
  });
});
