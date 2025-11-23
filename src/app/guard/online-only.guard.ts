<<<<<<< HEAD
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const onlineOnlyGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (navigator.onLine) {
    return true; // ✅ autorisé si connecté
  }
  // ❌ sinon on redirige vers la route hors-ligne
  return router.parseUrl('/hors-ligne/menu');
};
=======
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const onlineOnlyGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (navigator.onLine) {
    return true; // ✅ autorisé si connecté
  }
  // ❌ sinon on redirige vers la route hors-ligne
  return router.parseUrl('/hors-ligne/menu');
};
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
