import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auth } from '../services/auth';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     console.log('Intercepting request:', req);
//     const user = localStorage.getItem('loggedInUser');
    
//     if (user) {
//       const token = JSON.parse(user).token;
//       const clonedReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log('Token added to request:', clonedReq);
//       return next.handle(clonedReq);
//     }
    
//     return next.handle(req);
//   }
// }

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private auth = inject(Auth);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // 🔹 Skip auth endpoints
    if (req.url.includes('/auth/login') || 
        req.url.includes('/auth/refresh')) {
      return next.handle(req);
    }

    const token = this.auth.getAccessToken();

    if (!token) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true
    });

    return next.handle(cloned);
  }
}
