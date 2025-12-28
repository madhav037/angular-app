import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';
// import { Toast } from 'bootstrap';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(Auth);
  private router = inject(Router);
  private toast = inject(ToastService);

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z\d@._-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/),
    ]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false),
  });

  submit() {
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    const { email, password, rememberMe } = this.loginForm.value;

    this.authService.loginUser(email!, password!, rememberMe!).subscribe({
      next: () => {
        this.toast.show('Login Successful!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toast.show('Invalid email or password', 'error');
      },
    });
  }
}
