import { TestBed } from '@angular/core/testing';

import { ImageTs } from './image.ts';

describe('ImageTs', () => {
  let service: ImageTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
