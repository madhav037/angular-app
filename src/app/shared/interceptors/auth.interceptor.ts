import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Auth } from '../../services/auth';
import { environment } from '../../../environment/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(Auth);
  private count : number = 0;

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // console.log('AuthInterceptor invoked for URL:', req.url);
    if (environment.bypassAuthGuards === true) {
      console.log('Bypassing AuthInterceptor as per environment settings.');
      return next.handle(req);
    }

    if (req.url.includes('/Auth/login') || req.url.includes('/Auth/refresh') || req.url.includes("/Auth/logout")) {
      return next.handle(req.clone({ withCredentials: true }));
    }


    const token = this.auth.getAccessToken();
    let authReq = req;

    if (token) {
      authReq = this.addAuthHeader(req, token);
    }
    

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          return throwError(() => error);
        }
        return this.auth.refreshToken().pipe(
          switchMap((res) => {
            // this.auth.setAccessToken(res.accessToken);
            console.log("generated new access token:", res);
            console.log('no. of times new token is generated', ++this.count);
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

  private addAuthHeader(req: HttpRequest<any>, token: string) {
    // 🔥 DO NOT set Content-Type if body is FormData
    if (req.body instanceof FormData) {
      return req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
    }

    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }
}

