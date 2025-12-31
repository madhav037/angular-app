import { TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../injection.token';
import { Roles } from '../shared/model/roleModel';
import { User } from '../shared/model/userModel';

describe('Auth Service', () => {
  let service: Auth;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const APP_CONFIG_MOCK = {
    apiUrl: 'http://localhost:5000/api'
  };

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        Auth,
        { provide: Router, useValue: routerSpy },
        { provide: APP_CONFIG, useValue: APP_CONFIG_MOCK }
      ]
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store access token in session storage by default', () => {
    
    service.setAccessToken('test-token');
    const stored = JSON.parse(localStorage.getItem('loggedInUser')!);
    expect(stored.token).toBe('test-token');
  });

  it('should store access token in local storage when rememberMe is true', () => {
    service.loginUser('a@test.com', '123', true).subscribe();

    const loginReq = httpMock.expectOne('http://localhost:5000/api/Auth/login');
    loginReq.flush({ accessToken: 'test-token' });

    const meReq = httpMock.expectOne('http://localhost:5000/api/Auth/me');
    meReq.flush({ id: 1, fullName: 'Test', email: 'a@test.com', role: Roles.ADMIN } as User);

    const stored = JSON.parse(localStorage.getItem('loggedInUser')!);
    expect(stored.token).toBe('test-token');
  });

  it('should return access token from memory', () => {
    service.setAccessToken('abc');
    expect(service.getAccessToken()).toBe('abc');
  });

  it('should return access token from localStorage', () => {
    localStorage.setItem('loggedInUser', JSON.stringify({ token: 'test-token' }));
    expect(service.getAccessToken()).toBe('test-token');
  });

  it('should fetch users', () => {
    service.getUsers().subscribe(users => {
      expect(users.length).toBe(1);
    });

    const req = httpMock.expectOne('http://localhost:5000/api/User');
    req.flush([{ id: 1, fullName: 'User', email: 'u@test.com' }]);
  });

  it('should login and set user and role', () => {
    service.loginUser('test@test.com', '123', false).subscribe(user => {
      expect(user.role).toBe(Roles.ADMIN);
    });

    const loginReq = httpMock.expectOne('http://localhost:5000/api/Auth/login');
    loginReq.flush({ accessToken: 'jwt-token' });

    const meReq = httpMock.expectOne('http://localhost:5000/api/Auth/me');
    meReq.flush({ id: 1, fullName: 'Admin', email: 'test@test.com', role: Roles.ADMIN } as User);
  });

  it('should determine admin user correctly', () => {
    service.setUserRole(Roles.ADMIN);

    service.isUserAdmin().subscribe(isAdmin => {
      expect(isAdmin).toBeTrue();
    });
  });

  it('should refresh token and update access token', () => {
    service.refreshToken().subscribe();

    const req = httpMock.expectOne('http://localhost:5000/api/Auth/refresh');
    req.flush({ accessToken: 'new-token' });

    expect(service.getAccessToken()).toBe('new-token');
  });

  it('should logout and clear tokens', () => {
    service.setAccessToken('token');

    service.logoutUser();

    const req = httpMock.expectOne('http://localhost:5000/api/Auth/logout');
    req.flush({});

    expect(service.getAccessToken()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should initialize auth and load user if token exists', () => {
    sessionStorage.setItem('loggedInUser', JSON.stringify({ token: 'token' }));

    service.initializeAuth().subscribe(user => {
      expect(user?.email).toBe('test@test.com');
    });

    const meReq = httpMock.expectOne('http://localhost:5000/api/Auth/me');
    meReq.flush({ id: 1, fullName: 'User', email: 'test@test.com', role: Roles.USER } as User);
  });

  it('should logout if initializeAuth fails', () => {
    sessionStorage.setItem('loggedInUser', JSON.stringify({ token: 'token' }));

    service.initializeAuth().subscribe(result => {
      expect(result).toBeNull();
    });

    const meReq = httpMock.expectOne('http://localhost:5000/api/Auth/me');
    meReq.flush({}, { status: 401, statusText: 'Unauthorized' });

    const logoutReq = httpMock.expectOne('http://localhost:5000/api/Auth/logout');
    logoutReq.flush({});
  });
});
