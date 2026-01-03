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
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideNativeDateAdapter(),
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
    provideCharts(withDefaultRegisterables()),
  ],
};

export function authInitializer(auth: Auth) {
  return () => firstValueFrom(auth.initializeAuth());
}
