import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG } from '../../injection.token';
import { User } from '../../model/userModel';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: User | null = null;

  private router = inject(Router);
  private http = inject(HttpClient);
  private authservice = inject(Auth);

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser() {
    this.authservice.getCurrentUser()
      .subscribe({
        next: (user : User) => {
          this.user = user;
        },
        error: () => {
          this.user = null;
        },
      });
  }

  logout() {
    this.authservice.logoutUser();
  }
}
