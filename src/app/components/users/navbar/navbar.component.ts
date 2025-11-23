<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api/api.service';
import { NavigateService } from '../../../services/admin/navigate/navigate.service';

@Component({
  selector: 'app-navbar-u',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponentU implements OnInit {
  currentSettings: boolean = false;
  username: string = '';
  page: string = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private navigate: NavigateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Récupérer le nom d'utilisateur via l'API (sans `localStorage`)
    this.auth.getUsername().subscribe({
      next: (name) => {
        this.username = name;
      },
      error: () => {
        this.username = ''; // Sécurité si le token est expiré
      },
    });
  }

  tooglePage(page: string): void {
    this.navigate.togglePage(page);
  }

  toggleSettings(): void {
    this.currentSettings = !this.currentSettings;
  }

  logout(): void {
    this.auth.logout(); // ✅ Utiliser l'API `logout()` qui supprime le cookie
  }

  deleteAccount(): void {
    this.api.delete_account().subscribe({
      next: () => {
        this.auth.logout(); // ✅ Déconnexion après suppression
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du compte:', error);
      },
    });
  }
}
=======
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api/api.service';
import { NavigateService } from '../../../services/admin/navigate/navigate.service';

@Component({
  selector: 'app-navbar-u',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponentU implements OnInit {
  currentSettings: boolean = false;
  username: string = '';
  page: string = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private navigate: NavigateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // ✅ Récupérer le nom d'utilisateur via l'API (sans `localStorage`)
    this.auth.getUsername().subscribe({
      next: (name) => {
        this.username = name;
      },
      error: () => {
        this.username = ''; // Sécurité si le token est expiré
      },
    });
  }

  tooglePage(page: string): void {
    this.navigate.togglePage(page);
  }

  toggleSettings(): void {
    this.currentSettings = !this.currentSettings;
  }

  logout(): void {
    this.auth.logout(); // ✅ Utiliser l'API `logout()` qui supprime le cookie
  }

  deleteAccount(): void {
    this.api.delete_account().subscribe({
      next: () => {
        this.auth.logout(); // ✅ Déconnexion après suppression
      },
      error: (error) => {
        console.error('Erreur lors de la suppression du compte:', error);
      },
    });
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
