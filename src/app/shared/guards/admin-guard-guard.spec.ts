import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { adminGuard } from './admin-guard-guard';
import { Auth } from '../../services/auth';
import { Observable, of } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('adminGuard', () => {
  let authSpy: jasmine.SpyObj<Auth>;
  let routerSpy: jasmine.SpyObj<Router>;

  const route = {
    data: { requiredRole: 'ADMIN' }
  } as unknown as ActivatedRouteSnapshot;

  const state = {} as RouterStateSnapshot;

  beforeEach(() => {
    authSpy = jasmine.createSpyObj('Auth', ['getUserRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: authSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it('should allow access when role matches', (done) => {
    authSpy.getUserRole.and.returnValue(of('ADMIN'));

    const result$ = TestBed.runInInjectionContext(() =>
      adminGuard(route, state)
    ) as Observable<boolean>;

    result$.subscribe(result => {
      expect(result).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should deny access and redirect when role does not match', (done) => {
    spyOn(window, 'alert');
    authSpy.getUserRole.and.returnValue(of('USER'));

    const result$ = TestBed.runInInjectionContext(() =>
      adminGuard(route, state)
    ) as Observable<boolean>;

    result$.subscribe(result => {
      expect(result).toBeFalse();
      expect(window.alert).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
      done();
    });
  });
});
