import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-not-menu-provisor',
  styleUrl: './not-menu-provisor.scss',
  templateUrl: './not-menu-provisor.html',
})
export class NotMenuProvisor implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private mediaQuery: MediaQueryList | null = null;
  private mediaQueryHandler?: (event: MediaQueryListEvent) => void;

  readonly theme = signal<'light' | 'dark'>('light');

  ngOnInit(): void {
    this.mediaQuery =
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    this.applyTheme(this.getStoredTheme() ?? (this.mediaQuery?.matches ? 'dark' : 'light'), false);

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

  toggleTheme(): void {
    this.applyTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  private getStoredTheme(): 'light' | 'dark' | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem('theme');
    return stored === 'dark' || stored === 'light' ? stored : null;
  }

  private applyTheme(theme: 'light' | 'dark', persist = true): void {
    this.theme.set(theme);
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
