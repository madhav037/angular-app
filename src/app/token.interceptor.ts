import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('Intercepting request:', req);
        const user = localStorage.getItem('loggedInUser');
        if (user) {
            const token = JSON.parse(user).token;
            const clonedReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Token added to request:', clonedReq);
            return next.handle(clonedReq);
        }
        return next.handle(req);
    }
}