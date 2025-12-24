import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../injection.token';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { User } from '../shared/model/userModel';
import { Roles } from '../shared/model/roleModel';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly APP_CONFIG = inject(APP_CONFIG);
  readonly baseApiUrl = this.APP_CONFIG.apiUrl + '/User';

  private accessToken: string | null = null;
  private userRole$ = new BehaviorSubject<string | null>(null);

  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUser$ = new BehaviorSubject<User | null>(null);

  getUser$() {
    return this.currentUser$.asObservable();
  }

  setUser(user: User | null) {
    this.currentUser$.next(user);
  }

  getUsers() {
    return this.http.get(`${this.baseApiUrl}`);
  }

  setUserRole(role: string) {
    console.log('Setting user role:', role);
    this.userRole$.next(role);
  }

  getUserRole() {
    console.log('Getting user role:', this.userRole$.value);
    return this.userRole$.asObservable();
  }

  addUserDetail(payload: { fullName: string; email: string; password: string }) {
    return this.http.post(`${this.baseApiUrl}/create`, payload);
  }

  getUserByEmail(email: string) {
    return this.http.get(`${this.baseApiUrl}/email?email=${email}`);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseApiUrl}/delete/${userId}`);
  }

  updateUserDetails(
    userId: number,
    payload: { id: number; fullName: string; email?: string; password: string }
  ) {
    return this.http.put(`${this.baseApiUrl}/update/${userId}`, payload);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    if (this.accessToken) {
      return this.accessToken;
    } else if (localStorage.getItem('loggedInUser')) {
      const user = JSON.parse(localStorage.getItem('loggedInUser')!);
      this.accessToken = user.token;
      return this.accessToken;
    } else if (sessionStorage.getItem('loggedInUser')) {
      const user = JSON.parse(sessionStorage.getItem('loggedInUser')!);
      this.accessToken = user.token;
      return this.accessToken;
    } else {
      return null;
    }
  }

  isUserAdmin(): Observable<boolean> {
    return this.getUserRole().pipe(map((role) => role === Roles.ADMIN));
  }

  clearTokens() {
    this.accessToken = null;
  }

  // loginUser(email: string, password: string) {
  //   const url = `${environment.APIURL}/Auth/login`;
  //   return this.http.post(url, { email, password });
  // }
  loginUser(email: string, password: string, rememberMe: boolean = false) {
    const url = `${this.APP_CONFIG.apiUrl}/Auth/login`;
    return this.http
      .post<{ accessToken: string }>(url, { email, password }, { withCredentials: true })
      .pipe(
        tap((response) => {
          // this.accessToken = response.accessToken;
          this.setAccessToken(response.accessToken);
          this.setLocalStorageToken(response.accessToken, rememberMe);
        }),
        switchMap(() => this.getCurrentUser())
      );
  }

  setLocalStorageToken(token: string, rememberMe: boolean = false) {
    if (rememberMe) {
      localStorage.setItem('loggedInUser', JSON.stringify({ token }));
    } else {
      sessionStorage.setItem('loggedInUser', JSON.stringify({ token }));
    }
  }

  refreshToken() {
    const url = `${this.APP_CONFIG.apiUrl}/Auth/refresh`;

    return this.http
      .post<{ accessToken: string }>(url, {}, { withCredentials: true })
      .pipe(tap((res) => this.setAccessToken(res.accessToken)));
  }

  logoutUser() {
    const url = `${this.APP_CONFIG.apiUrl}/Auth/logout`;

    this.http.post(url, {}, { withCredentials: true }).subscribe({
      complete: () => {
        this.clearTokens();
        localStorage.removeItem('loggedInUser');
        sessionStorage.removeItem('loggedInUser');
        this.router.navigate(['/login']);
      },
    });
  }

  getCurrentUser(): Observable<User> {
    const url = `${this.APP_CONFIG.apiUrl}/Auth/me`;
    return this.http.get<User>(url, { withCredentials: true }).pipe(
      tap((user) => {
        this.setUser(user);
        this.setUserRole(user.role);
      })
    );
  }

  initializeAuth(): Observable<User | null> {
    const token = this.getAccessToken();

    if (!token) {
      return of(null);
    }

    return this.getCurrentUser().pipe(
      catchError(() => {
        this.logoutUser();
        return of(null);
      })
    );
  }

  // logoutUser() {
  //   localStorage.removeItem('loggedInUser');
  //   this.router.navigate(['/login']);
  // }
}
