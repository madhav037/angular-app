import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.js';
import { APP_CONFIG } from '../injection.token.js';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehicleImageModel } from '../shared/model/vehicleModel.js';

describe('ImageService', () => {
  let service: ImageService;
  let httpMock: HttpTestingController;

  const APP_CONFIG_MOCK = {
    apiUrl: 'http://localhost:5000/api',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ImageService, { provide: APP_CONFIG, useValue: APP_CONFIG_MOCK }],
    });
    service = TestBed.inject(ImageService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload image', () => {
    const formData = new FormData();
    formData.append('file', new Blob(['dummy content'], { type: 'image/png' }), 'test.png');

    const mockResponse: VehicleImageModel = {
      imageUrl: 'http://image-url',
      publicId: '1',
    };

    service.uploadImage(formData).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/Image/upload');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should delete image', () => {
    service.deleteImage('img123').subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:5000/api/Image/delete/img123');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
