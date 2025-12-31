import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
// import {
//   BrowserDynamicTestingModule,
//   platformBrowserDynamicTesting
// } from '@angular/platform-browser-dynamic/testing';
import { APP_CONFIG } from './app/injection.token';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/hi';


getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

getTestBed().configureTestingModule({
  providers: [
    {
      provide: APP_CONFIG,
      useValue: {
        apiUrl: 'http://localhost:5000/api'
      }
    }
  ]
});
