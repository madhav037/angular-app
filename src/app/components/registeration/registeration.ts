import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
// import { Toast } from 'bootstrap';
import { Auth } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-registeration',
  imports: [Navbar, RouterLink, ReactiveFormsModule],
  templateUrl: './registeration.html',
  styleUrl: './registeration.css',
})
export class Registeration {
  private authService = inject(Auth);
  private router = inject(Router);
  private toast = inject(ToastService);

  registerationForm = new FormGroup(
    {
      fullName: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z\d@._-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@_!#$*%])[A-Za-z\d@_!#$*%]{8,}$/),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      termsCheck: new FormControl(false, [Validators.requiredTrue]),
    },
    { validators: this.passwordMatchValidator() }
  );

  passwordMatchValidator(): ValidatorFn {
    return (group: AbstractControl) => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        console.log('Validating passwords:', password, confirmPassword);
        group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      }

      return null;
    };
  }

  updateStrengthBar() {
    const password = this.registerationForm.get('password')?.value || '';
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    let strength = 0;
    if (password.length == 0) strength = 0;
    if (password.length >= 3) strength++;
    if (password.length >= 5) strength ++;
    if (password.length >= 8) strength ++;
    if (password.length >= 12) strength ++;
    if (/[A-Z]/.test(password)) strength ++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength +=2;
    if (/[@_!#$*%]/.test(password)) strength +=2;

    if (strengthBar && strengthText) {
      switch (strength) {
        case 0:
        case 1:
        case 2:
          strengthText.innerText = 'Weak';
          strengthBar.style.backgroundColor = 'red';
          break;
        case 3:
        case 4:
        case 5:
          strengthText.innerText = 'Moderate';
          strengthBar.style.backgroundColor = 'orange';
          break;
        case 6:
        case 7:
        case 8:
        case 9:
          strengthText.innerText = 'Strong';
          strengthBar.style.backgroundColor = 'blue';
          break;
        case 10:
          strengthText.innerText = 'Very Strong';
          strengthBar.style.backgroundColor = 'green';
          break;
      }
      strengthBar.style.width = strength * 10 + '%';
    }
  }

  submit() {
    this.registerationForm.markAllAsTouched();

    if (this.registerationForm.invalid) {
      return;
    }

    const payload = {
      fullName: this.registerationForm.value.fullName!,
      email: this.registerationForm.value.email!,
      password: this.registerationForm.value.password!,
    };

    this.authService.getUserByEmail(payload.email).subscribe({
      next: (users: any) => {
        console.log('Existing users with this email:', users);
        if (users.length > 0) {
          this.toast.show('Email is already registered.', 'warning');
          return;
        }

        this.authService.addUserDetail(payload).subscribe({
          next: (response) => {
            this.toast.show('Registration Successful!', 'success');
            console.log('User registered successfully:', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Error registering user:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error checking email:', error);
      },
    });

    console.log('Sending payload:', payload);
  }
}
