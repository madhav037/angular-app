import { TestBed } from '@angular/core/testing';

import { Vehicle } from './vehicle';

xdescribe('Vehicle', () => {
  let service: Vehicle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vehicle);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
