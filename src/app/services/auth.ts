import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../injection.token';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { User } from '../model/userModel';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly APP_CONFIG = inject(APP_CONFIG);
  readonly baseApiUrl = this.APP_CONFIG.apiUrl + '/User';

  private accessToken: string | null = null;

  private http = inject(HttpClient);
  private router = inject(Router);

  getUsers() {
    return this.http.get(`${this.baseApiUrl}`);
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
    return this.accessToken;
  }

  clearTokens() {
    this.accessToken = null;
  }

  // loginUser(email: string, password: string) {
  //   const url = `${environment.APIURL}/Auth/login`;
  //   return this.http.post(url, { email, password });
  // }
  loginUser(email: string, password: string, temporary: boolean = false) {
    const url = `${this.APP_CONFIG.apiUrl}/Auth/login`;
    return this.http
      .post<{ accessToken: string }>(url, { email, password }, { withCredentials: true })
      .pipe(
        tap((response) => {
          this.accessToken = response.accessToken;
          this.setLocalStorageToken(response.accessToken, temporary);
        })
      );
  }

  setLocalStorageToken(token: string, temporary: boolean = false) {
    if (temporary) {
      sessionStorage.setItem('loggedInUser', JSON.stringify({ token }));
    } else {
      localStorage.setItem('loggedInUser', JSON.stringify({ token }));
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
        this.router.navigate(['/login']);
      },
    });
  }

  getCurrentUser(): Observable<User> {
    const url = `${this.APP_CONFIG.apiUrl}/auth/me`;
    return this.http.get<User>(url, { withCredentials: true });
  }

  restoreSession(): Observable<boolean> {
    return this.http
      .post<any>(`${this.APP_CONFIG.apiUrl}/auth/refresh`, {}, { withCredentials: true })
      .pipe(
        tap((res) => this.setAccessToken(res.accessToken)),
        map(() => true),
        catchError(() => of(false))
      );
  }

  // logoutUser() {
  //   localStorage.removeItem('loggedInUser');
  //   this.router.navigate(['/login']);
  // }
}
