import {
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isApiRequest = request.url.startsWith(environment.apiBaseUrl);

  if (!isApiRequest) {
    return next(request);
  }

  return from(authService.getValidToken()).pipe(
    switchMap((token) => {
      const authorizedRequest = token
        ? request.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
          })
        : request;

      return next(authorizedRequest);
    }),
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.handleUnauthorized();
        void router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};
