import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../services/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // 🚫 Skip auth endpoints
    if (req.url.includes('/auth/login') || req.url.includes('/auth/refresh')) {
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

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401(authReq, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.refreshToken().pipe(
        switchMap((res) => {
          this.isRefreshing = false;

          this.auth.setAccessToken(res.accessToken);
          this.refreshTokenSubject.next(res.accessToken);

          return next.handle(
            req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`,
              },
              withCredentials: true,
            })
          );
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.auth.logoutUser();
          return throwError(() => err);
        })
      );
    }

    // ⏳ Wait for refresh to finish
    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) =>
        next.handle(
          req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
        )
      )
    );
  }
}
