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
    canActivate: [authGuard]
  }
];
