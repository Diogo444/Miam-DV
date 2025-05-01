import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RienComponent } from '../rien/rien.component';
import { ApiService } from '../../../services/api/api.service';
import { Menu, Periode } from './menu.model';
import { Proverbe } from './proverbe.model';
import { LoaderComponent } from '../loader/loader.component';
import { LocalstorageService } from '../../../services/localstorage/localstorage.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, RienComponent, LoaderComponent],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'], // Correction de styleUrl en styleUrls
})
export class MenuComponent implements OnInit, OnDestroy {
  role: string = '';
  currentDate: Date = this.adjustForWeekend(new Date());
  jours = { actuel: '', suivant: '' };

  menu: Menu[] = [];
  proverbe: Proverbe[] = [];
  displayedMenu: { midi?: Menu; soir?: Menu } = {};

  loading = true;
  bg = '';
  color_text = '';
  color_type = '';

  joursSemaineFr = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private auth: AuthService,
    private localStorage: LocalstorageService
  ) {}

  ngOnInit(): void {
    this.jours = {
      actuel: this.getFrenchDay(this.currentDate),
      suivant: this.getFrenchNextDay(),
    };

    // Récupération du rôle et appel de applyPreferences après
    this.auth
      .getRole()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (role) => {
          this.role = role;
          this.applyPreferences(); // 👉 Appel après récupération du rôle
        },
        error: () => {
          this.role = 'guest';
        },
      });

    this.loadMenu();
    this.loadProverbes();
  }

  private loadMenu(): void {
    this.apiService
      .getMenu()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuData: Menu[]) => {
          this.loading = false;
          this.menu = menuData;
          this.updateDisplayedMenu();
        },
        error: (error) => {
          this.loading = false;
          console.error('Erreur lors de la récupération du menu :', error);
          this.menu = [];
          this.updateDisplayedMenu();
        },
        complete: () => (this.loading = false),
      });
  }

  private loadProverbes(): void {
    this.apiService
      .getProverbe()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (proverbeData: Proverbe[]) => (this.proverbe = proverbeData),
        error: (error) =>
          console.error(
            'Erreur lors de la récupération des proverbes :',
            error
          ),
      });
  }

  private applyPreferences(): void {
    if (this.role !== 'user' && this.role !== 'admin') {
      return;
    }

    this.apiService
      .getPreferences()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (preferences) => {
          if (preferences.length > 0) {
            const prefs = preferences[0];
            this.localStorage.setItem('preferences', JSON.stringify(prefs));
            this.bg = prefs.bg_container;
            this.color_text = prefs.color_text;
            this.color_type = prefs.color_text_type;
          } else {
            console.warn('Aucune préférence trouvée.');
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des préférences :', error);
        },
      });
  }

  private updateDisplayedMenu(): void {
    const filteredMenu = this.menu.filter(
      (item) =>
        item.jour === this.jours.actuel &&
        (item.periode === Periode.MIDI || item.periode === Periode.Soir)
    );

    this.displayedMenu = {
      midi: filteredMenu.find((item) => item.periode === Periode.MIDI),
      soir: filteredMenu.find((item) => item.periode === Periode.Soir),
    };
  }

  nextDay(): void {
    this.currentDate = this.getNextValidDate(this.currentDate, 1);
    this.jours.actuel = this.jours.suivant;
    this.jours.suivant = this.getFrenchNextDay();
    this.updateDisplayedMenu();
  }

  logJourActuel(): boolean {
    return this.jours.actuel !== 'vendredi';
  }

  previousDay(): void {
    this.currentDate = this.getNextValidDate(this.currentDate, -1);
    this.jours.suivant = this.jours.actuel;
    this.jours.actuel = this.getFrenchDay(this.currentDate);
    this.updateDisplayedMenu();
  }

  private getFrenchDay(date: Date): string {
    return this.joursSemaineFr[date.getDay()];
  }

  private getFrenchNextDay(): string {
    return this.getFrenchDay(this.getNextValidDate(this.currentDate, 1));
  }

  private getNextValidDate(date: Date, increment: number): Date {
    const newDate = new Date(date);
    do {
      newDate.setDate(newDate.getDate() + increment);
    } while (newDate.getDay() === 0 || newDate.getDay() === 6);
    return newDate;
  }

  private adjustForWeekend(date: Date): Date {
    if (date.getDay() === 0) date.setDate(date.getDate() + 1);
    else if (date.getDay() === 6) date.setDate(date.getDate() + 2);
    return date;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
