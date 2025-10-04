import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const requiredRoles = route.data['role'];
    return this.authService.getRole().pipe(
      map((role) => {
        if (!role) {
          return this.router.parseUrl('/login');
        }
        if (requiredRoles && requiredRoles.includes(role)) {
          return true;
        }
        if (role === 'user') {
          return this.router.parseUrl('/user');
        }
        if (role === 'admin') {
          return this.router.parseUrl('/admin');
        }
        return this.router.parseUrl('/');
      })
    );
  }


  
  
  
}
