import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-admin',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-admin.html',
  styleUrl: './nav-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavAdmin implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryHandler?: (event: MediaQueryListEvent) => void;

  readonly links = [
    { label: 'Ajouter le menu', icon: 'add_circle', commands: ['/admin', 'ajouter-menu'] },
    { label: 'Modifier le menu', icon: 'edit', commands: ['/admin', 'modifier-menu'] },
    { label: 'Blagues suggérées', icon: 'lightbulb', commands: ['/admin', 'blagues'] },
    { label: 'Gérer administrateurs', icon: 'shield_person', commands: ['/admin', 'administrateurs'] }
  ];

  sidebarOpen = false;
  theme: 'light' | 'dark' = 'light';

  ngOnInit(): void {
    this.mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    this.applyTheme(this.resolveInitialTheme());

    if (this.mediaQuery) {
      this.mediaQueryHandler = event => {
        if (!this.getStoredTheme()) {
          this.applyTheme(event.matches ? 'dark' : 'light', false);
        }
      };
      this.mediaQuery.addEventListener('change', this.mediaQueryHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.mediaQuery && this.mediaQueryHandler) {
      this.mediaQuery.removeEventListener('change', this.mediaQueryHandler);
    }
  }

  toggleSidebar(force?: boolean): void {
    this.sidebarOpen = typeof force === 'boolean' ? force : !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  toggleTheme(): void {
    this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
  }

  private resolveInitialTheme(): 'light' | 'dark' {
    const stored = this.getStoredTheme();
    if (stored) {
      return stored;
    }
    if (this.mediaQuery?.matches) {
      return 'dark';
    }
    return 'light';
  }

  private getStoredTheme(): 'light' | 'dark' | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  }

  private applyTheme(theme: 'light' | 'dark', persist = true): void {
    this.theme = theme;
    const htmlElement = this.document.documentElement;
    htmlElement.classList.toggle('dark', theme === 'dark');
    htmlElement.classList.toggle('light', theme === 'light');
    htmlElement.style.colorScheme = theme;
    htmlElement.dataset['theme'] = theme;
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }
}
