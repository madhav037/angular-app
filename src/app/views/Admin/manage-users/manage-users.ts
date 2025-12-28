import { Component, computed, inject, signal } from '@angular/core';
import { Auth } from '../../../services/auth';
import { ToastService } from '../../../services/toast';
import { User } from '../../../shared/model/userModel';

@Component({
  selector: 'app-manage-users',
  imports: [],
  templateUrl: './manage-users.html',
  styleUrl: './manage-users.css',
})
export class ManageUsers {
  private authService = inject(Auth);
  private toastService = inject(ToastService);

  userLists = signal<Array<User>>([]);
  totalUsers = computed(() => this.userLists().length);

  ngOnInit() {
    this.authService.getUsers().subscribe({
      next: (users) => {
        this.userLists.set(users);
        this.toastService.show('Users fetched successfully', 'success');
        console.log('Fetched users:', users);
      },
      error: (error) => {
        this.toastService.show('Failed to fetch users', 'error');
        console.error('Error fetching users:', error);
      }
    });
  }
}
