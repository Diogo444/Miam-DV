import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, timeout, retry, timer } from 'rxjs';
import { Auth } from '../services/auth/auth';

// Configuration des timeouts et retries
const REQUEST_TIMEOUT = 30000; // 30 secondes
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 seconde entre les retries

// Requêtes qui ne doivent pas être retryées (mutations)
const NO_RETRY_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Intercepteur HTTP avec :
 * - Injection automatique du token JWT
 * - Timeout configurable
 * - Retry avec backoff exponentiel pour les GET
 * - Gestion centralisée des erreurs 401/403
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  // Clone la requête avec le token si disponible
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Déterminer si on peut retry cette requête
  const canRetry = !NO_RETRY_METHODS.includes(req.method);

  let request$ = next(authReq).pipe(
    // Timeout pour éviter les requêtes qui pendent indéfiniment
    timeout(REQUEST_TIMEOUT),
    
    // Gestion centralisée des erreurs
    catchError((error: HttpErrorResponse | Error) => {
      // Erreur de timeout
      if (error.name === 'TimeoutError') {
        console.error(`[HTTP] Request timeout: ${req.method} ${req.url}`);
        return throwError(() => new HttpErrorResponse({
          error: { message: 'La requête a expiré. Vérifiez votre connexion.' },
          status: 0,
          statusText: 'Timeout',
          url: req.url,
        }));
      }

      // Erreur HTTP
      if (error instanceof HttpErrorResponse) {
        // 401/403 = déconnexion
        if (error.status === 401 || error.status === 403) {
          console.warn(`[HTTP] Auth error ${error.status}: ${req.url}`);
          auth.logout();
          router.navigate(['/login']);
        }
        
        // Log pour debug
        if (error.status === 0) {
          console.error(`[HTTP] Network error: ${req.method} ${req.url}`, error);
        } else if (error.status >= 500) {
          console.error(`[HTTP] Server error ${error.status}: ${req.url}`, error);
        }
      }

      return throwError(() => error);
    }),
  );

  // Ajouter retry pour les GET uniquement
  if (canRetry && MAX_RETRIES > 0) {
    request$ = next(authReq).pipe(
      timeout(REQUEST_TIMEOUT),
      retry({
        count: MAX_RETRIES,
        delay: (error, retryCount) => {
          // Ne pas retry les erreurs 4xx (sauf timeout/network)
          if (error instanceof HttpErrorResponse && error.status >= 400 && error.status < 500) {
            throw error;
          }
          // Backoff exponentiel
          const delayMs = RETRY_DELAY * Math.pow(2, retryCount - 1);
          console.log(`[HTTP] Retry ${retryCount}/${MAX_RETRIES} for ${req.url} in ${delayMs}ms`);
          return timer(delayMs);
        },
      }),
      catchError((error: HttpErrorResponse | Error) => {
        if (error.name === 'TimeoutError') {
          return throwError(() => new HttpErrorResponse({
            error: { message: 'La requête a expiré. Vérifiez votre connexion.' },
            status: 0,
            statusText: 'Timeout',
            url: req.url,
          }));
        }

        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            auth.logout();
            router.navigate(['/login']);
          }
        }

        return throwError(() => error);
      }),
    );
  }

  return request$;
};
