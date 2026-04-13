import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app-routing.module';
import { HttpCredentialsInterceptor } from './app/services/http-credentials.interceptor';
import { CorsLoggerService } from './app/services/cors-logger.service';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    CorsLoggerService, // Serviço de logging CORS
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCredentialsInterceptor,
      multi: true,
    },
  ],
}).catch((err) => console.error(err));
