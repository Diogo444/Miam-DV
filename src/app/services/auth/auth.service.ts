import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Vérifie si l'utilisateur est authentifié en appelant le backend
  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<{ authenticated: boolean }>(`/auth/check`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.authenticated),
        catchError(() => {
          this.router.navigate(['/login']); // Redirige si non authentifié
          return [false];
        })
      );
  }

  // ✅ Récupère le rôle de l'utilisateur depuis l'API
  getRole(): Observable<string> {
    return this.http
      .get<{ role: string; message?: string }>(`/auth/role`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (response.message === 'Token expiré') {
            console.warn('Token expiré, déconnexion...');
            this.router.navigate(['/login']);
            return 'guest';
          }
          return response.role || 'guest'; // Sécurise le retour si `role` est undefined
        }),
        catchError((error) => {
          console.error('Erreur lors de la récupération du rôle :', error);
          this.router.navigate(['/login']);
          return of('guest'); // Retourne un `Observable` de string correct
        })
      );
  }

  // ✅ Récupère le nom d'utilisateur depuis l'API
  getUsername(): Observable<string> {
    return this.http
      .get<{ name: string }>(`/auth/user`, {
        withCredentials: true,
      })
      .pipe(
        map((response) => response.name),
        catchError(() => [''])
      );
  }

  // ✅ Déconnexion (Supprime le cookie en appelant le backend)
  logout(): void {
    this.http
      .post(`auth/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.router.navigate(['/login']);
      });
  }
}
