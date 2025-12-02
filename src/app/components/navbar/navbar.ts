import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { User } from '../../model/userModel';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  user: User | null = null;
  router = inject(Router);

  ngOnInit(): void {
    const stored = localStorage.getItem('loggedInUser') ?? sessionStorage.getItem('loggedInUser');
    this.user = stored ? JSON.parse(stored) : null;
  }

  logout() {
    localStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('loggedInUser');

    this.router.navigate(['/login']);
  }
}
