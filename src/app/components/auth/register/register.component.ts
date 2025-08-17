import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api/api.service';
import { LocalstorageService } from '../../../services/localstorage/localstorage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private api: ApiService, private router: Router) {}

  onRegister(): void {
    this.api.register(this.username, this.password).subscribe(
      (response: any) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
        this.handleError(error);
      }
    );
  }

  private handleError(error: any): void {
    if (error.status === 400) {
      this.message = 'Veuillez remplir tous les champs requis.';
    } else if (error.status === 409) {
      this.message = "Le nom d'utilisateur est déjà pris.";
    } else if (error.status === 422) {
      this.message = 'Le mot de passe doit contenir au moins 4 caractères.';
    } else if (error.status === 500) {
      this.message =
        'Une erreur interne du serveur est survenue. Veuillez réessayer plus tard.';
    } else {
      this.message = 'Une erreur inconnue est survenue.';
    }
  }
}
