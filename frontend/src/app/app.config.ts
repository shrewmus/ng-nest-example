import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthService } from './core/auth.service';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { routes } from './app.routes';

function initializeAuth(authService: AuthService): () => Promise<void> {
  return () => authService.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
