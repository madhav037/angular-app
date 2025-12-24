import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../injection.token';
import { User } from '../../shared/model/userModel';
import { Auth } from '../../services/auth';
import { Roles } from '../../shared/model/roleModel';
import { Observable, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authservice = inject(Auth);
  private router = inject(Router);
  private http = inject(HttpClient);

  user$: Observable<User | null>;
  adminRole = Roles.ADMIN;

  constructor() {
    this.user$ = this.authservice.getUser$();
    this.adminRole = Roles.ADMIN;
    console.log('Navbar initialized. Current user observable set.', this.user$.pipe(tap(user => console.log('Current user in Navbar:', user))));
  }

  logout() {
    this.authservice.logoutUser();
  }
}
