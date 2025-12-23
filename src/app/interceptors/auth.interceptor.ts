import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('AuthInterceptor invoked for URL:', req.url);

    if (req.url.includes('/Auth/login') || req.url.includes('/Auth/refresh') || req.url.includes("/Auth/logout")) {
      return next.handle(req.clone({ withCredentials: true }));
    }

    const token = this.auth.getAccessToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    }
    console.log('Request with Auth Headers:', authReq);

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }
        return this.auth.refreshToken().pipe(
          switchMap((res) => {
            this.auth.setAccessToken(res.accessToken);
            console.log('Token refreshed in interceptor');
            return next.handle(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${res.accessToken}`,
                },
                withCredentials: true,
              })
            );
          }),
          catchError(() => {
            this.auth.logoutUser();
            return throwError(() => error);
          })
        );
      })
    );
  }
}