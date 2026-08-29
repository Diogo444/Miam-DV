import { Component } from '@angular/core';
import { NavPublic } from '../public/nav-public/nav-public';
import { FormsModule } from '@angular/forms';

import { Api } from '../../services/api/api';
import { LoginResponse } from '../../models/auth.model';

import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';





@Component({
  selector: 'app-login',
  imports: [NavPublic, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  password: string = '';
  response: LoginResponse | null = null;
  errorMessage: string | null = null;
  constructor(protected api: Api, protected authService: Auth, protected router: Router) {}

  onSubmit() {
    this.errorMessage = null;
    this.api.login(this.username, this.password).subscribe({
      next: (response) => {
        this.response = response;
        this.authService.saveTokenAndRole(response.access_token, response.user.role);
        this.router.navigate(['/admin']);

      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage =
          error?.status === 401
            ? "Nom d'utilisateur ou mot de passe incorrect."
            : 'Une erreur est survenue. Merci de réessayer.';
      }
    });
  }




}
