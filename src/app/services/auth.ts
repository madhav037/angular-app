import { inject, Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly baseApiUrl = environment.APIURL + '/User';

  private http = inject(HttpClient);

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

  updateUserDetails(userId: number, payload: {id : number, fullName: string; email?: string; password: string }) {
    return this.http.put(`${this.baseApiUrl}/update/${userId}`, payload);
  }

  loginUser(email: string, password: string) {
    const url = `${environment.APIURL}/Auth/login`;
    return this.http.post(url, { email, password });
  }
}
