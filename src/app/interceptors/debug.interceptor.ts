import { HttpInterceptorFn } from '@angular/common/http';

export const debugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('➡️ Request URL:', req.urlWithParams);
  console.log('➡️ Method:', req.method);
  console.log('➡️ Headers:', req.headers.keys());
  console.log('➡️ Body:', req.body);

  return next(req);
};