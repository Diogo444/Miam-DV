import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const role = this.authService.getRole();  // Récupère le rôle de l'utilisateur
    const requiredRoles = route.data['role'];  // Récupère les rôles requis pour la route

    // Si aucun token n'est trouvé, l'utilisateur est considéré comme "guest"
    if (!role) {
      this.router.navigate(['/login']);
      return false;
    }

    // Si l'utilisateur a le bon rôle pour la route, on permet l'accès
    if (requiredRoles && requiredRoles.includes(role)) {
      return true;
    } else {
      // Si l'utilisateur n'a pas le bon rôle, on le redirige vers la page appropriée
      if (role === 'user') {
        this.router.navigate(['/user']);
      } else if (role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);  // Si l'utilisateur est un "guest" ou n'a pas de rôle
      }
      return false;
    }
}


  
  
  
}
