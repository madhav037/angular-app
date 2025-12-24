import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { TokenInterceptor } from './interceptors/token.interceptor';
import { APP_CONFIG } from './injection.token';
import { environment } from '../environment/environment';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { Auth } from './services/auth';
import { firstValueFrom } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useValue: debugInterceptor, multi: true },
    {
      provide: APP_CONFIG,
      useFactory: () => ({
        apiUrl: environment.APIURL,
        environment: environment.ENVIRONMENT,
      }),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      deps: [Auth],
      multi: true,
    },
  ],
};

export function authInitializer(auth: Auth) {
  return () => firstValueFrom(auth.initializeAuth());
}
