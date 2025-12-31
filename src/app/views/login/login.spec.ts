import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../shared/model/userModel';
import { Roles } from '../../shared/model/roleModel';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  let authMock: jasmine.SpyObj<Auth>;
  let toastMock: jasmine.SpyObj<ToastService>;

  const activatedRouteMock = {
    snapshot: {
      queryParams: {},
    },
  };

  beforeEach(async () => {
    authMock = jasmine.createSpyObj('Auth', ['loginUser']);
    toastMock = jasmine.createSpyObj('ToastService', ['show']);

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form invalid when empty', () => {
    component.submit();

    expect(component.loginForm.invalid).toBeTrue();
    expect(authMock.loginUser).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call loginUser and navigate on success', () => {
    const mockUser : User = {
      id: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      password: 'Password@123',
      role: Roles.USER,
    };

    authMock.loginUser.and.returnValue(of(mockUser));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.submit();

    expect(authMock.loginUser).toHaveBeenCalledWith(
      'test@example.com',
      'password123',
      true
    );

    expect(toastMock.show).toHaveBeenCalledWith(
      'Login Successful!',
      'success'
    );

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error toast on login failure', () => {
    authMock.loginUser.and.returnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.loginForm.setValue({
      email: 'wrong@example.com',
      password: 'wrongpass',
      rememberMe: false,
    });

    component.submit();

    expect(toastMock.show).toHaveBeenCalledWith(
      'Invalid email or password',
      'error'
    );

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
