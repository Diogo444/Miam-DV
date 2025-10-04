import { Routes } from '@angular/router';
import { offlineGuard } from './guard/offline.guard';
import { onlineOnlyGuard } from './guard/online-only.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [onlineOnlyGuard],
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    canActivate: [onlineOnlyGuard],
    loadComponent: () =>
      import('./components/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canActivate: [onlineOnlyGuard],
    loadComponent: () =>
      import('./components/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'recipe/:slug',
    canActivate: [onlineOnlyGuard],
    loadComponent: () =>
      import('./components/public/recettes/plat/plat.component').then(
        (m) => m.PlatComponent
      ),
  },

  // ✅ accessible uniquement hors-ligne
  {
    path: 'hors-ligne/menu',
    canActivate: [offlineGuard],
    loadComponent: () =>
      import('./components/public/menu/menu.component').then(
        (m) => m.MenuComponent
      ),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
