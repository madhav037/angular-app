import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { Vehicle } from '../../services/vehicle';
import { ToastService } from '../../services/toast';
import { Auth } from '../../services/auth';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/hi';
import { APP_CONFIG } from '../../injection.token';

describe('Dashboard component', () => {
  let fixture: ComponentFixture<Dashboard>;
  let component: Dashboard;

  let vehicleSpy: jasmine.SpyObj<Vehicle>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let authSpy: jasmine.SpyObj<Auth>;

  beforeEach(async () => {
    registerLocaleData(localeIn);
    vehicleSpy = jasmine.createSpyObj('Vehicle', [
      'GetPagedVehicles',
      'GetFilteredPagedVehicles',
      'deleteVehicle',
    ]);

    toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    authSpy = jasmine.createSpyObj('Auth', ['isUserAdmin']);

    authSpy.isUserAdmin.and.returnValue(of(true));

    vehicleSpy.GetFilteredPagedVehicles.and.returnValue(
      of(
        new HttpResponse({
          body: [],
          headers: new HttpHeaders({ 'X-Has-Next-Page': 'false' }),
        })
      )
    );

    vehicleSpy.GetPagedVehicles.and.returnValue(
      of(
        new HttpResponse({
          body: [],
          headers: new HttpHeaders({ 'X-Has-Next-Page': 'false' }),
        })
      )
    );

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            apiUrl: 'http://localhost:5000/api',
          },
        },
        { provide: Vehicle, useValue: vehicleSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Auth, useValue: authSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set admin flag from auth service', () => {
    expect(component.isUserAdmin()).toBeTrue();
  });

  it('should load vehicles on init', () => {
    expect(vehicleSpy.GetPagedVehicles).toHaveBeenCalled();
    expect(component.filteredVehicles().length).toBe(0);
  });

  it('should change page to next', () => {
    component.changePage('next');
    expect(component.currentPage()).toBe(2);
  });

  it('should change page to prev', () => {
    component.currentPage.set(2);
    component.changePage('prev');
    expect(component.currentPage()).toBe(1);
  });

  it('should delete vehicle when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    vehicleSpy.deleteVehicle.and.returnValue(of(void 0));

    component.deleteVehicle(1, 'Car');

    expect(vehicleSpy.deleteVehicle).toHaveBeenCalledWith(1);
    expect(toastSpy.show).toHaveBeenCalledWith('Vehicle deleted successfully', 'success');
  });
});
