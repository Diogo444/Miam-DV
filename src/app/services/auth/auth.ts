import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
  exp?: number;
};

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
      const { exp } = jwtDecode<JwtPayload>(token);
      if (typeof exp !== 'number') {
        return true;
      }
      const now = Math.floor(Date.now() / 1000);
      return exp < now;
    } catch {
      return true;
    }
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
  }
  isAdmin(): boolean {
    return localStorage.getItem('auth_role') === 'admin';
  }
}
