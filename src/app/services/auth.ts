import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly baseApiUrl = environment.APIURL;

  private http = inject(HttpClient);

  getUsers() {
    return this.http.get(`${this.baseApiUrl}/users`);
  }

  addUserDetail(payload: { fullName: string; email: string; password: string }) {
    return this.http.post(`${this.baseApiUrl}/users`, payload);
  }

  getUserByEmail(email: string) {
    return this.http.get(`${this.baseApiUrl}/users?email=${email}`);
  }

  deleteUser(userId: number) {
    return this.http.delete(`${this.baseApiUrl}/users/${userId}`);
  }

  updateUserDetails(userId: number, payload: { fullName?: string; email?: string; password?: string }) {
    return this.http.put(`${this.baseApiUrl}/users/${userId}`, payload);
  }
}
