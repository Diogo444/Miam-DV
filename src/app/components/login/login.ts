import { Component } from '@angular/core';
import { NavPublic } from '../public/nav-public/nav-public';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api/api';
import { LoginResponse } from '../../models/auth.model';

import { jwtDecode } from 'jwt-decode';
import { Auth } from '../../services/auth/auth';
import { Router } from '@angular/router';





@Component({
  selector: 'app-login',
  imports: [NavPublic, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  password: string = '';
  response: LoginResponse | null = null;
  constructor(protected api: Api, protected authService: Auth, protected router: Router) {}

  onSubmit() {
    this.api.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        this.response = response;
        // You can store the token and redirect the user as needed
        console.log('JWT Token:', response.access_token);
        const decoded: any = jwtDecode(response.access_token);
        console.log('Decoded JWT:', decoded);
        this.authService.saveTokenAndRole(response.access_token, decoded.role);
        this.router.navigate(['/admin']);

      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }




}
