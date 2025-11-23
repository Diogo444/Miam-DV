<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { LocalstorageService } from '../../../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-username',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './username.component.html',
  styleUrl: './username.component.scss',
})
export class UsernameComponent implements OnInit {
  username: string = '';
  newUsername: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private localStorage: LocalstorageService
  ) {}
  ngOnInit(): void {
    this.auth.getUsername().subscribe((username) => (this.username = username));
  }
  onSubmit(): void {
    const token = this.localStorage.getItem('token');
    if (token) {
      // Vérifie si le token est non nul
      this.api.change_username(this.newUsername, token).subscribe(
        (resp) => {
          // Si la mise à jour est réussie, on met à jour le token et redirige l'utilisateur
          this.localStorage.setItem('token', resp.token);
          this.router.navigate([this.router.url]);
        },
        (error) => {
          // Afficher un message d'erreur spécifique à l'utilisateur
          console.error('Error changing username:', error);
          alert(
            "Une erreur est survenue lors de la mise à jour de votre nom d'utilisateur."
          );
        }
      );
    } else {
      // Afficher un message d'erreur si le token est manquant
      console.error('Token is missing');
      alert('Le token est manquant. Veuillez vous reconnecter.');
    }
  }
}
=======
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { LocalstorageService } from '../../../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-username',
  imports: [RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './username.component.html',
  styleUrl: './username.component.scss',
})
export class UsernameComponent implements OnInit {
  username: string = '';
  newUsername: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private localStorage: LocalstorageService
  ) {}
  ngOnInit(): void {
    this.auth.getUsername().subscribe((username) => (this.username = username));
  }
  onSubmit(): void {
    const token = this.localStorage.getItem('token');
    if (token) {
      // Vérifie si le token est non nul
      this.api.change_username(this.newUsername, token).subscribe(
        (resp) => {
          // Si la mise à jour est réussie, on met à jour le token et redirige l'utilisateur
          this.localStorage.setItem('token', resp.token);
          this.router.navigate([this.router.url]);
        },
        (error) => {
          // Afficher un message d'erreur spécifique à l'utilisateur
          console.error('Error changing username:', error);
          alert(
            "Une erreur est survenue lors de la mise à jour de votre nom d'utilisateur."
          );
        }
      );
    } else {
      // Afficher un message d'erreur si le token est manquant
      console.error('Token is missing');
      alert('Le token est manquant. Veuillez vous reconnecter.');
    }
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
