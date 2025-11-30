import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const token = localStorage.getItem('auth_token');

  // Pas de token → on retourne à login
  if (!token) {
    return router.parseUrl('/login');
  }

  // Token expiré → logout + retour login
  if (auth.isTokenExpired(token)) {
    auth.logout();
    return router.parseUrl('/login');
  }

  // Pas admin → redirection propre vers l'accueil
  if (!auth.isAdmin()) {
    return router.parseUrl('/');
  }


  // Tout est bon → accès OK
  return true;
};
