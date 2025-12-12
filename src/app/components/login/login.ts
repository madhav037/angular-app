import { Component, inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../services/toast';
// import { Toast } from 'bootstrap';

@Component({
  selector: 'app-login',
  imports: [Navbar, ReactiveFormsModule, RouterLink],
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

    const payload = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService.getUserByEmail(payload.email).subscribe({
      next: (responseUser: any) => {
        if (!responseUser) {
          this.toast.show('Invalid email or password.', 'error');
          return;
        }

        const user = responseUser;
        if (user.password !== payload.password) {
          this.toast.show('Invalid email or password.', 'error');
          return;
        }

        
        this.authService.loginUser(payload.email, payload.password).subscribe(
          (response) => {
            let tokeneduser = { ...user, token: (response as any).token };
            if (this.loginForm.value.rememberMe) {
              localStorage.setItem('loggedInUser', JSON.stringify(tokeneduser));
            } else {
              sessionStorage.setItem('loggedInUser', JSON.stringify(tokeneduser));
            }
            this.toast.show('Login Successful!', 'success');
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error('Login error:', error);
          }
        );
      },
      error: (error) => {
        console.error('Error during login:', error);
      },
    });

    console.log('Sending payload:', payload);
  }
}
