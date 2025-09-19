import { bootstrapApplication } from '@angular/platform-browser';
import { RootComponent } from './root.component';
import { appConfig } from './app.config';

bootstrapApplication(RootComponent, appConfig)
  .catch(err => console.error(err));
