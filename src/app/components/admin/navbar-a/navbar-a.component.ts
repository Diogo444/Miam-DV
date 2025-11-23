<<<<<<< HEAD
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigateService } from '../../../services/admin/navigate/navigate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-a',
  imports: [CommonModule],
  templateUrl: './navbar-a.component.html',
  styleUrl: './navbar-a.component.scss',
})
export class NavbarAComponent implements OnInit, OnDestroy {
  page: string = '';
  menuOpen = false;
  isMobile = false;

  constructor(private navigate: NavigateService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    // Empêche le défilement du body quand le menu est ouvert en version mobile
    if (this.isMobile) {
      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    }
  }
  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  navigeteTo(page: string): void {
    this.menuOpen = false;
    this.navigate.togglePage(page);
  }
}
=======
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigateService } from '../../../services/admin/navigate/navigate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-a',
  imports: [CommonModule],
  templateUrl: './navbar-a.component.html',
  styleUrl: './navbar-a.component.scss',
})
export class NavbarAComponent implements OnInit, OnDestroy {
  page: string = '';
  menuOpen = false;
  isMobile = false;

  constructor(private navigate: NavigateService) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;

    // Empêche le défilement du body quand le menu est ouvert en version mobile
    if (this.isMobile) {
      document.body.style.overflow = this.menuOpen ? 'hidden' : '';
    }
  }
  ngOnInit() {
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.checkScreenSize.bind(this));
  }
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
  }

  navigeteTo(page: string): void {
    this.menuOpen = false;
    this.navigate.togglePage(page);
  }
}
>>>>>>> afe05af085bf6474cb15d6eaf7a64896e5a8f91a
