import { Routes } from '@angular/router';
import { authGuard } from './guards/auth/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/public/home/home').then(m => m.Home)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login').then(m => m.Login)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/home/home').then(m => m.Home),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'ajouter-menu'
      },
      {
        path: 'ajouter-menu',
        loadComponent: () =>
          import('./components/admin/add-menu/add-menu').then(m => m.AddMenu)
      },
      {
        path: 'modifier-menu',
        loadComponent: () =>
          import('./components/admin/edit-menu/edit-menu').then(m => m.EditMenu)
      },
      {
        path: 'blagues',
        loadComponent: () =>
          import('./components/admin/afficher-suggestions/afficher-suggestions').then(m => m.AfficherSuggestions)
      },
      {
        path: 'administrateurs',
        loadComponent: () =>
          import('./components/admin/gere-admins/gere-admins').then(m => m.GereAdmins)
      }
    ]
  }
];
