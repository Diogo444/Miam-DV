import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const offlineGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!navigator.onLine) {
    return true; // ✅ autoriser si l'utilisateur est hors ligne
  }

  // ❌ sinon on redirige vers l'accueil ou login
  return router.parseUrl('/');
};
