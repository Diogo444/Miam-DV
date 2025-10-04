import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiService } from '../../../services/api/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalstorageService } from '../../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  message: string = '';

  constructor(private api: ApiService, private router: Router) {}

  onSubmit(): void {
    this.api.login(this.username, this.password).subscribe(
      () => {
        this.router.navigate(['/']); // ✅ Le cookie est géré automatiquement
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  private handleError(error: any): void {
    if (error.status === 400) {
      this.message = 'Veuillez remplir tous les champs requis.';
    } else if (error.status === 404) {
      this.message = "L'utilisateur n'existe pas.";
    } else if (error.status === 401) {
      this.message = 'Mot de passe incorrect.';
      this.password = '';
    } else {
      this.message = 'Une erreur est survenue.';
    }
  }
}
