<<<<<<< HEAD
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigateService } from '../../../services/admin/navigate/navigate.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  page: string = '';
  isAccountBoxVisible: boolean = false;
  constructor(private router: Router, private navigate: NavigateService) {}

  toggleAccountBox(): void {
    this.isAccountBoxVisible = !this.isAccountBoxVisible;
  }
  togglePage(page: string) {
    this.navigate.togglePage(page);
  }

  // Navigation vers login ou signup
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
    this.isAccountBoxVisible = false; // Ferme la boîte après navigation
  }
}
=======
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigateService } from '../../../services/admin/navigate/navigate.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  page: string = '';
  isAccountBoxVisible: boolean = false;
  constructor(private router: Router, private navigate: NavigateService) {}

  toggleAccountBox(): void {
    this.isAccountBoxVisible = !this.isAccountBoxVisible;
  }
  togglePage(page: string) {
    this.navigate.togglePage(page);
  }

  // Navigation vers login ou signup
  navigateTo(route: string): void {
    this.router.navigate([`/${route}`]);
    this.isAccountBoxVisible = false; // Ferme la boîte après navigation
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
