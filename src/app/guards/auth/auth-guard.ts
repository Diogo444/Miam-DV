import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = localStorage.getItem('auth_token');

  // Pas de token → on retourne à login
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // Token expiré → logout + retour login
  if (auth.isTokenExpired(token)) {
    auth.logout();
    router.navigate(['/']);
    return false;
  }

  // Pas admin → retour page d'accueil (ou autre)
  if (!auth.isAdmin()) {
    router.navigate(['/login']);
    return false;
  }

  console.log('Auth Guard: accès autorisé pour admin.');

  // Tout est bon → accès OK
  return true;
};
