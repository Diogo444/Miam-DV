import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  saveTokenAndRole(token: string, role: string) {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_role', role);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch (e) {
      return true; // Si erreur de décodage, considérer le token comme expiré
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  }
  isAdmin(): boolean {
    const role = localStorage.getItem('auth_role');
    if (role === 'admin') {
      return true;
    } else {
      return false;
    }

  }
}
