import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Login } from './login';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let router: Router;

  const authMock = {
    loginUser: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const toastMock = {
    show: vi.fn(),
  };
  const ActivatedRouteMock = {
    snapshot: {
      queryParams: {},
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: Auth, useValue: authMock },
        // { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
        { provide: ToastService, useValue: toastMock },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate');

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form invalid when empty', () => {
    component.submit();

    expect(component.loginForm.invalid).toBe(true);
    expect(authMock.loginUser).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should call loginUser and navigate on success', () => {
    authMock.loginUser.mockReturnValue(of(true));

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    });

    component.submit();

    expect(authMock.loginUser).toHaveBeenCalledWith('test@example.com', 'password123', true);

    expect(toastMock.show).toHaveBeenCalledWith('Login Successful!', 'success');

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error toast on login failure', async () => {
    authMock.loginUser.mockReturnValue(throwError(() => new Error('Invalid credentials')));

    component.loginForm.setValue({
      email: 'wrong@example.com',
      password: 'wrongpass',
      rememberMe: false,
    });

    component.submit();
    // await fixture.whenStable();
    expect(toastMock.show).toHaveBeenCalledWith('Invalid email or password', 'error');

    expect(router.navigate).not.toHaveBeenCalled();
  });
});
