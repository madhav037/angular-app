import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { registerLocaleData } from '@angular/common';
import localeIn from '@angular/common/locales/hi';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

registerLocaleData(localeIn);
