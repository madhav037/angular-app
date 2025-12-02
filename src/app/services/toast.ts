import { Injectable } from '@angular/core';

declare var bootstrap: any;

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    const container = document.getElementById('global-toast-container');

    const colorClass = {
      success: 'text-success',
      error: 'text-danger',
      warning: 'text-warning',
      info: 'text-info',
    }[type];

    // Create toast HTML
    const toast = document.createElement('div');
    toast.className = `toast align-items-center ${colorClass} border-0 mb-2 bg-light fw-bold rounded-3`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    toast.classList.add('show');

    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-dark me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    container?.appendChild(toast);

    // Activate Bootstrap toast
    const toastInstance = new bootstrap.Toast(toast, { delay: 3000 });
    toastInstance.show();

    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
  }
}
