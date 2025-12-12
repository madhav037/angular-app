import { TestBed } from '@angular/core/testing';

import { BigRequest } from './big-request';

describe('BigRequest', () => {
  let service: BigRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BigRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
